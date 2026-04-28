-- Aggregate functions for admin stats — avoids pulling 10k–50k rows into the API server.

-- Sum all views_count across listings
create or replace function get_total_views_count()
returns bigint
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(sum(views_count), 0) from listings;
$$;

-- Active listing count by category
create or replace function get_active_listings_by_category()
returns table (category_name text, listing_count bigint)
language sql
stable
security definer
set search_path = public
as $$
  select
    coalesce(c.name, 'Uncategorized') as category_name,
    count(*) as listing_count
  from listings l
  left join categories c on c.id = l.category_id
  where l.status = 'active'
  group by coalesce(c.name, 'Uncategorized')
  order by listing_count desc;
$$;

-- Daily counts grouped by date for chart data
create or replace function get_daily_counts(
  table_name text,
  start_date timestamptz,
  end_date timestamptz default now()
)
returns table (date_bucket date, cnt bigint)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if table_name = 'profiles' then
    return query
      select created_at::date as date_bucket, count(*) as cnt
      from profiles
      where created_at >= start_date and created_at <= end_date
      group by created_at::date
      order by date_bucket;
  elsif table_name = 'listings' then
    return query
      select created_at::date as date_bucket, count(*) as cnt
      from listings
      where created_at >= start_date and created_at <= end_date
      group by created_at::date
      order by date_bucket;
  elsif table_name = 'leads' then
    return query
      select created_at::date as date_bucket, count(*) as cnt
      from leads
      where created_at >= start_date and created_at <= end_date
      group by created_at::date
      order by date_bucket;
  end if;
end;
$$;

-- Grant execute to authenticated and service_role
grant execute on function get_total_views_count() to authenticated, service_role;
grant execute on function get_active_listings_by_category() to authenticated, service_role;
grant execute on function get_daily_counts(text, timestamptz, timestamptz) to authenticated, service_role;
