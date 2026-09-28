import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// 服务端专用：用 service_role 密钥（绕过 RLS），审核过滤由代码保证。
// 本模块只能在服务端组件 / 路由处理器里 import（server-only 会拦下客户端误用）。
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function getAdminSupabase(): SupabaseClient | null {
  if (!url || !serviceRoleKey) return null;
  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

// 拼出 Storage 公开地址（bucket 为 public）
export function storageUrl(path: string): string {
  return `${url}/storage/v1/object/public/gallery/${path}`;
}
