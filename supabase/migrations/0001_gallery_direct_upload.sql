-- 影像馆：改为「浏览器直传 Supabase（TUS 可断点续传）」
-- 在 Supabase Dashboard → SQL Editor 里一次性执行即可。
-- 执行前请确认 gallery 桶已设为 public（读取地址用的是 /object/public/gallery/）。

-- 1) 允许匿名用户直接上传到 gallery 桶（展示仍由应用层 status='pending' 审核控制）
create policy "gallery_anon_insert"
  on storage.objects
  for insert
  to anon
  with check (bucket_id = 'gallery');

-- 2) 单文件上限提到 10GB（10737418240 字节）。
--    注意：TUS 断点续传还受 Storage 全局上限约束，若仍被拒，去
--    Dashboard → Storage → Settings 里把全局 TUS 上限也调高。
update storage.buckets
set file_size_limit = 10737418240
where id = 'gallery';

-- 可选加固：只允许图片/视频的 MIME 类型（防无关文件占用空间）。
-- 如启用后个别正常视频被误拦，删掉下面两句即可。
-- update storage.buckets
-- set allowed_mime_types = array['image/*', 'video/*']
-- where id = 'gallery';
