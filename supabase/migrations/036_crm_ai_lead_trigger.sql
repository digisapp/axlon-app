-- Auto-create CRM contacts when AI chat captures a lead
-- Maps dealer_ai_leads → crm_contacts with source='ai_chat'

CREATE OR REPLACE FUNCTION create_crm_contact_from_ai_lead()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create if we have at least a name
  IF NEW.visitor_name IS NOT NULL AND NEW.visitor_name != '' THEN
    INSERT INTO crm_contacts (
      dealer_id,
      name,
      email,
      phone,
      status,
      source,
      notes,
      deal_value,
      last_contact_at,
      created_at
    ) VALUES (
      NEW.dealer_id,
      NEW.visitor_name,
      NEW.visitor_email,
      NEW.visitor_phone,
      'new',
      'ai_chat',
      COALESCE('AI Lead: ' || NEW.equipment_interest, '') ||
        CASE WHEN NEW.budget_range IS NOT NULL THEN ' | Budget: ' || NEW.budget_range ELSE '' END ||
        CASE WHEN NEW.timeline IS NOT NULL THEN ' | Timeline: ' || NEW.timeline ELSE '' END ||
        CASE WHEN NEW.ai_summary IS NOT NULL THEN E'\n' || NEW.ai_summary ELSE '' END,
      0,
      NOW(),
      NOW()
    )
    ON CONFLICT DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER auto_create_crm_from_ai_lead
  AFTER INSERT ON dealer_ai_leads
  FOR EACH ROW
  EXECUTE FUNCTION create_crm_contact_from_ai_lead();
