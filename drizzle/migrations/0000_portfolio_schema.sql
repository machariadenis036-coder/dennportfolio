
create type public.app_role as enum ('admin', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "Users read own roles" on public.user_roles for select to authenticated
using (user_id = auth.uid());

-- Grant admin to the owner once email is confirmed
create or replace function public.grant_owner_admin()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.email_confirmed_at is not null and lower(new.email) = 'machariadenis036@gmail.com' then
    insert into public.user_roles (user_id, role) values (new.id, 'admin')
    on conflict (user_id, role) do nothing;
  end if;
  return new;
end;
$$;

create trigger on_auth_user_owner_admin
after insert or update of email_confirmed_at on auth.users
for each row execute function public.grant_owner_admin();

create or replace function public.touch_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end;
$$;

-- PROFILE (singleton)
create table public.site_profile (
  id int primary key default 1 check (id = 1),
  name text not null default 'Denis',
  brand text not null default 'DENIS WEB DEVELOPER',
  title text not null default 'Web Developer | IT Student | Aspiring Software Developer',
  hero_intro text not null default '',
  about text not null default '',
  highlights text[] not null default '{}',
  email text not null default 'machariadenis036@gmail.com',
  github_url text not null default 'https://github.com/machariadenis036-coder',
  whatsapp text not null default '254117244681',
  location text not null default 'Kenya',
  photo_url text,
  institution text not null default 'Kirinyaga University',
  course text not null default 'Bachelor''s Degree in Information Technology',
  academic_level text not null default 'Degree',
  footer_tagline text not null default '',
  updated_at timestamptz not null default now()
);
grant select on public.site_profile to anon, authenticated;
grant update on public.site_profile to authenticated;
grant all on public.site_profile to service_role;
alter table public.site_profile enable row level security;
create policy "Profile is public" on public.site_profile for select to anon, authenticated using (true);
create policy "Admin updates profile" on public.site_profile for update to authenticated
using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
create trigger site_profile_touch before update on public.site_profile for each row execute function public.touch_updated_at();

-- SKILLS
create table public.skills (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  name text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
grant select on public.skills to anon, authenticated;
grant insert, update, delete on public.skills to authenticated;
grant all on public.skills to service_role;
alter table public.skills enable row level security;
create policy "Skills are public" on public.skills for select to anon, authenticated using (true);
create policy "Admin inserts skills" on public.skills for insert to authenticated with check (public.has_role(auth.uid(), 'admin'));
create policy "Admin updates skills" on public.skills for update to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
create policy "Admin deletes skills" on public.skills for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

-- PROJECTS
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  tech text[] not null default '{}',
  repo_url text,
  demo_url text,
  image_url text,
  featured boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
grant select on public.projects to anon, authenticated;
grant insert, update, delete on public.projects to authenticated;
grant all on public.projects to service_role;
alter table public.projects enable row level security;
create policy "Projects are public" on public.projects for select to anon, authenticated using (true);
create policy "Admin inserts projects" on public.projects for insert to authenticated with check (public.has_role(auth.uid(), 'admin'));
create policy "Admin updates projects" on public.projects for update to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
create policy "Admin deletes projects" on public.projects for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

-- MESSAGES
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 100),
  email text not null check (char_length(email) between 3 and 255),
  subject text not null check (char_length(subject) between 1 and 150),
  message text not null check (char_length(message) between 1 and 2000),
  is_read boolean not null default false,
  emailed boolean not null default false,
  created_at timestamptz not null default now()
);
grant insert on public.messages to anon, authenticated;
grant select, update, delete on public.messages to authenticated;
grant all on public.messages to service_role;
alter table public.messages enable row level security;
create policy "Anyone can send a message" on public.messages for insert to anon, authenticated
with check (is_read = false and emailed = false);
create policy "Admin reads messages" on public.messages for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admin updates messages" on public.messages for update to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
create policy "Admin deletes messages" on public.messages for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

-- SEED
insert into public.site_profile (id, hero_intro, about, highlights, footer_tagline) values (
  1,
  'I am a passionate Information Technology student and aspiring software developer with an interest in building modern, practical and user-friendly digital solutions. I enjoy turning ideas into functional applications while continuously exploring new technologies and improving my technical abilities.',
  E'I am Denis, an Information Technology student at Kirinyaga University with a strong interest in web development, programming and technology. I enjoy developing applications that solve practical problems and make technical processes easier. My learning journey involves exploring different programming languages, improving my problem-solving abilities and building projects that demonstrate my technical skills.\n\nI believe in continuous learning, creativity, teamwork and using technology to develop meaningful solutions.',
  array['Information Technology student.','Interested in software and web development.','Passionate about solving technical problems.','Enjoys learning new technologies.','Focused on continuous professional development.'],
  'Building modern, practical and user-friendly digital solutions.'
);

insert into public.skills (category, name, sort_order) values
 ('Web Development','HTML',1),('Web Development','CSS',2),('Web Development','JavaScript',3),
 ('Programming','Python',1),('Programming','C++',2),
 ('Database Management','MySQL',1),
 ('Other Technical Skills','Computer Troubleshooting',1),('Other Technical Skills','Graphic Design',2),('Other Technical Skills','Microsoft Office',3),
 ('Professional Skills','Communication Skills',1),('Professional Skills','Leadership',2),('Professional Skills','Time Management',3),('Professional Skills','Teamwork and Collaboration',4);

insert into public.projects (title, description, tech, repo_url, featured, sort_order) values (
 'System Converter App',
 'A number system conversion application designed to simplify numerical conversions between different number systems. The application supports binary, octal, decimal and hexadecimal conversions, together with complement operations used in digital logic. It helps users understand number systems and solve conversion problems more efficiently.',
 array['HTML','CSS','JavaScript'],
 'https://github.com/machariadenis036-coder/Binary_Conv.git',
 true, 1);
