import json
import audit_agent


def test_query_ledger_returns_paid_gujarat_invoice():
    rows = json.loads(audit_agent.query_ledger("select Invoice_ID, Vendor_ID, Amount, Status from Invoices where Vendor_ID = 'VEN-1000'"))
    assert rows == [{"Invoice_ID": "INV-2000", "Vendor_ID": "VEN-1000", "Amount": 500000.0, "Status": "Paid"}]


def test_query_ledger_returns_schema_guidance_for_malformed_select():
    result = json.loads(audit_agent.query_ledger("select p.Payment_Amount from Payments p"))

    assert result["error"] == "Invalid SELECT for this ledger schema"
    assert "Tables: Vendors, Invoices, Payments" in result["schema_hint"]


def test_check_delivery_log_finds_fourteen_day_late_record():
    rows = json.loads(audit_agent.check_delivery_log("VEN-1000"))
    assert any(row["days_late"] == 14 for row in rows)


def test_build_discrepancy_summary_calculates_penalty():
    report = audit_agent.build_discrepancy_summary("Gujarat Steel Corp")
    assert report["vendor_id"] == "VEN-1000"
    assert report["invoice_amount"] == 500000.0
    assert report["days_late"] == 14
    assert report["penalty_amount_inr"] == 25000.0


def test_build_augmented_prompt_includes_local_context_for_known_vendor():
    prompt = audit_agent.build_augmented_prompt("Audit the account for Gujarat Steel Corp.")

    assert "Gujarat Steel Corp" in prompt
    assert "VEN-1000" in prompt
    assert "Tables: Vendors, Invoices, Payments" in prompt
    assert "INV-2000" in prompt
    assert "REC-500" in prompt
    assert "5% penalty" in prompt
    assert "check_delivery_log(\"VEN-1000\")" in prompt
