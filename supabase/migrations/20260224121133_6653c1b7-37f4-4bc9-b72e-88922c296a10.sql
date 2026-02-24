
-- Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- User roles table (separate from profiles per security requirements)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Class status enum
CREATE TYPE public.class_status AS ENUM ('pending', 'approved', 'rejected');

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  roll_no TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  avatar_url TEXT,
  class_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Classes table
CREATE TABLE public.classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  college TEXT NOT NULL,
  department TEXT NOT NULL,
  year TEXT NOT NULL,
  section TEXT NOT NULL DEFAULT '',
  class_code TEXT UNIQUE NOT NULL DEFAULT substr(md5(random()::text), 1, 8),
  owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status class_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;

-- Add FK for profiles.class_id
ALTER TABLE public.profiles ADD CONSTRAINT fk_profiles_class FOREIGN KEY (class_id) REFERENCES public.classes(id) ON DELETE SET NULL;

-- Courses table
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  course_name TEXT NOT NULL,
  course_code TEXT NOT NULL,
  description TEXT DEFAULT '',
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- Announcements table
CREATE TABLE public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL,
  attachment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Materials table
CREATE TABLE public.materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  uploaded_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;

-- Discussions table
CREATE TABLE public.discussions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.discussions ENABLE ROW LEVEL SECURITY;

-- Replies table
CREATE TABLE public.replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  discussion_id UUID NOT NULL REFERENCES public.discussions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_helpful BOOLEAN DEFAULT false,
  parent_reply_id UUID REFERENCES public.replies(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.replies ENABLE ROW LEVEL SECURITY;

-- Timetable entries
CREATE TABLE public.timetable_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  subject TEXT NOT NULL,
  faculty_name TEXT DEFAULT '',
  room_number TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.timetable_entries ENABLE ROW LEVEL SECURITY;

-- Notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'general',
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Helper: check if user is in a given class
CREATE OR REPLACE FUNCTION public.user_in_class(_user_id UUID, _class_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = _user_id AND class_id = _class_id
  )
$$;

-- Helper: get user's class_id
CREATE OR REPLACE FUNCTION public.get_user_class_id(_user_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT class_id FROM public.profiles WHERE id = _user_id
$$;

-- Trigger for auto-creating profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, roll_no, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'roll_no', 'UNKNOWN_' || substr(NEW.id::text, 1, 8)),
    NEW.email
  );
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_classes_updated_at BEFORE UPDATE ON public.classes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON public.announcements FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_discussions_updated_at BEFORE UPDATE ON public.discussions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_replies_updated_at BEFORE UPDATE ON public.replies FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ==================== RLS POLICIES ====================

-- User roles: users can read their own roles
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);

-- Profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can view classmates" ON public.profiles FOR SELECT 
  USING (class_id IS NOT NULL AND class_id = public.get_user_class_id(auth.uid()));
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Classes
CREATE POLICY "Anyone can view approved classes" ON public.classes FOR SELECT USING (status = 'approved');
CREATE POLICY "Owners can view own pending classes" ON public.classes FOR SELECT USING (owner_id = auth.uid());
CREATE POLICY "Authenticated users can create classes" ON public.classes FOR INSERT TO authenticated WITH CHECK (owner_id = auth.uid());
CREATE POLICY "Owners can update own classes" ON public.classes FOR UPDATE USING (owner_id = auth.uid());
CREATE POLICY "Admins can manage all classes" ON public.classes FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Courses: class members can view, owner/admin can manage
CREATE POLICY "Class members can view courses" ON public.courses FOR SELECT USING (public.user_in_class(auth.uid(), class_id));
CREATE POLICY "Class members can create courses" ON public.courses FOR INSERT TO authenticated WITH CHECK (public.user_in_class(auth.uid(), class_id));
CREATE POLICY "Admins manage courses" ON public.courses FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Announcements
CREATE POLICY "Class members can view announcements" ON public.announcements FOR SELECT USING (public.user_in_class(auth.uid(), class_id));
CREATE POLICY "Class members can post announcements" ON public.announcements FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid() AND public.user_in_class(auth.uid(), class_id));
CREATE POLICY "Users can update own announcements" ON public.announcements FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete own announcements" ON public.announcements FOR DELETE USING (user_id = auth.uid());
CREATE POLICY "Admins manage announcements" ON public.announcements FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Materials: class members via course->class
CREATE POLICY "Members can view materials" ON public.materials FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.courses c WHERE c.id = course_id AND public.user_in_class(auth.uid(), c.class_id)));
CREATE POLICY "Members can upload materials" ON public.materials FOR INSERT TO authenticated 
  WITH CHECK (uploaded_by = auth.uid() AND EXISTS (SELECT 1 FROM public.courses c WHERE c.id = course_id AND public.user_in_class(auth.uid(), c.class_id)));
CREATE POLICY "Admins manage materials" ON public.materials FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Discussions
CREATE POLICY "Members can view discussions" ON public.discussions FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.courses c WHERE c.id = course_id AND public.user_in_class(auth.uid(), c.class_id)));
CREATE POLICY "Members can create discussions" ON public.discussions FOR INSERT TO authenticated 
  WITH CHECK (user_id = auth.uid() AND EXISTS (SELECT 1 FROM public.courses c WHERE c.id = course_id AND public.user_in_class(auth.uid(), c.class_id)));
CREATE POLICY "Users can update own discussions" ON public.discussions FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete own discussions" ON public.discussions FOR DELETE USING (user_id = auth.uid());

-- Replies
CREATE POLICY "Members can view replies" ON public.replies FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.discussions d JOIN public.courses c ON c.id = d.course_id WHERE d.id = discussion_id AND public.user_in_class(auth.uid(), c.class_id)));
CREATE POLICY "Members can create replies" ON public.replies FOR INSERT TO authenticated 
  WITH CHECK (user_id = auth.uid() AND EXISTS (SELECT 1 FROM public.discussions d JOIN public.courses c ON c.id = d.course_id WHERE d.id = discussion_id AND public.user_in_class(auth.uid(), c.class_id)));
CREATE POLICY "Users can update own replies" ON public.replies FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete own replies" ON public.replies FOR DELETE USING (user_id = auth.uid());

-- Timetable entries
CREATE POLICY "Class members can view timetable" ON public.timetable_entries FOR SELECT USING (public.user_in_class(auth.uid(), class_id));
CREATE POLICY "Class owner can manage timetable" ON public.timetable_entries FOR INSERT TO authenticated 
  WITH CHECK (EXISTS (SELECT 1 FROM public.classes WHERE id = class_id AND owner_id = auth.uid()));
CREATE POLICY "Class owner can update timetable" ON public.timetable_entries FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM public.classes WHERE id = class_id AND owner_id = auth.uid()));
CREATE POLICY "Class owner can delete timetable" ON public.timetable_entries FOR DELETE 
  USING (EXISTS (SELECT 1 FROM public.classes WHERE id = class_id AND owner_id = auth.uid()));
CREATE POLICY "Admins manage timetable" ON public.timetable_entries FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Notifications
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "System can create notifications" ON public.notifications FOR INSERT TO authenticated WITH CHECK (true);
