-- Migration 057: Chat RLS lockdown (companion to 056)
--
-- 056_security_fixes.sql deliberately LEFT the public chat SELECT policies from
-- 006_dealer_storefronts.sql permissive because the older /api/chat route read
-- chat_conversations / chat_messages with the ANON session client (its
-- SELECT-back-after-insert and history rebuild needed anon read). Narrowing RLS
-- first would have broken the live storefront ChatWidget flow.
--
-- Both visitor-facing routes now use the service-role admin client with an
-- httpOnly 'axlon_chat_visitor' fingerprint cookie for ownership checks:
--   * src/app/api/chat/route.ts       (POST) - createAdminClient
--   * src/app/api/chat/lead/route.ts  (POST) - createAdminClient
-- (POST/PUT /api/ai/dealer-chat already did.) Service role bypasses RLS, so we
-- can now drop the anon read/write holes and scope these tables to
-- dealer-owner (auth.uid()) + service_role.
--
-- Every authenticated read path is dealer-scoped by dealer_id = auth.uid():
--   * /api/dashboard/conversations, /api/dashboard/conversations/[id](/reply),
--     /api/dashboard/ai-performance, /api/dealer/ai-leads (server client)
--   * dashboard/conversations pages + realtime chat_messages subscription
--     (browser client, dealer session) -> covered by the dealer SELECT policies
--     below (messages join to the parent conversation's dealer_id).
--
-- Idempotent: DROP POLICY IF EXISTS before every CREATE POLICY.

-- ============================================================================
-- chat_conversations
-- ============================================================================

ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;

-- Drop the permissive visitor-side policies from 006. The anon INSERT + anon
-- UPDATE (auth.uid() = dealer_id is NULL for anon, but the INSERT was WITH
-- CHECK (true)) and the dealer SELECT are all replaced below. Visitor writes
-- now go exclusively through the service-role routes.
DROP POLICY IF EXISTS "Anyone can start a conversation" ON chat_conversations;   -- 006:74 (anon INSERT hole)
DROP POLICY IF EXISTS "Dealers can update own conversations" ON chat_conversations; -- 006:78
DROP POLICY IF EXISTS "Dealers can view own conversations" ON chat_conversations;  -- 006:70

-- Dealer can read their own conversations.
CREATE POLICY "Dealers can view own conversations" ON chat_conversations
  FOR SELECT
  USING (auth.uid() = dealer_id);

-- Dealer can update their own conversations (e.g. dashboard status changes).
CREATE POLICY "Dealers can update own conversations" ON chat_conversations
  FOR UPDATE
  USING (auth.uid() = dealer_id)
  WITH CHECK (auth.uid() = dealer_id);

-- Service role: full access (RLS-bypassing, kept explicit). All visitor
-- create/update writes flow through here from the admin-client routes.
DROP POLICY IF EXISTS "Service role full access to conversations" ON chat_conversations;
CREATE POLICY "Service role full access to conversations" ON chat_conversations
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ============================================================================
-- chat_messages
-- ============================================================================

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Drop the 006 policies:
--   * the SELECT policy that passed whenever the parent
--     visitor_fingerprint IS NOT NULL (true for every visitor row -> public read)
--   * the anon "Anyone can add messages" INSERT (WITH CHECK true)
DROP POLICY IF EXISTS "Users can view messages in accessible conversations" ON chat_messages; -- 006:82
DROP POLICY IF EXISTS "Anyone can add messages" ON chat_messages;                              -- 006:92

-- Dealer can read messages of conversations they own.
CREATE POLICY "Dealers can view messages in own conversations" ON chat_messages
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM chat_conversations
      WHERE chat_conversations.id = chat_messages.conversation_id
        AND chat_conversations.dealer_id = auth.uid()
    )
  );

-- Dealer can insert messages (replies) into conversations they own.
DROP POLICY IF EXISTS "Dealers can add messages to own conversations" ON chat_messages;
CREATE POLICY "Dealers can add messages to own conversations" ON chat_messages
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM chat_conversations
      WHERE chat_conversations.id = chat_messages.conversation_id
        AND chat_conversations.dealer_id = auth.uid()
    )
  );

-- Service role: full access. Visitor message inserts + history reads flow
-- through here from the admin-client /api/chat route.
DROP POLICY IF EXISTS "Service role full access to messages" ON chat_messages;
CREATE POLICY "Service role full access to messages" ON chat_messages
  FOR ALL TO service_role USING (true) WITH CHECK (true);
