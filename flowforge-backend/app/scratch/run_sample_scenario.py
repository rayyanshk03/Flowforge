"""
Sample Scenario Verification Script — Task #25.

Runs the exact sample scenario:
Origin: CNSHA
Destination: JPYOK
Carrier: MAERSK
Mode: Ocean
Cargo Weight: 15 MT
Quantity: 250
Cargo Value: $120,000
Baseline ETA: 168 hours
Disruption: Rotterdam congestion 87%
"""
import asyncio
import json
from app.schemas.requests import ShipmentAnalysisRequest
from app.agents.orchestrator import orchestrator

async def main():
    req = ShipmentAnalysisRequest(
        origin_unlocode="CNSHA",
        destination_unlocode="JPYOK",
        carrier_code="MAERSK",
        shipment_mode="Ocean",
        cargo_weight_mt=15.0,
        cargo_quantity=250,
        cargo_value_usd=120000.0,
        baseline_eta_hours=168.0,
        vessel_speed_knots=18.0
    )
    
    res = await orchestrator.analyze_shipment(req)
    
    print("=== SAMPLE SCENARIO ANALYSIS RESULT ===")
    print(f"Analysis ID: {res.get('analysis_id')}")
    print(f"Shipment: {res.get('shipment')}")
    print(f"Disruption Probability: {res.get('agents', {}).get('disruption', {}).get('disruption_probability')}")
    print(f"Predicted ETA Hours: {res.get('agents', {}).get('eta', {}).get('predicted_total_hours')} hours")
    print(f"Monte Carlo Resilience: {res.get('agents', {}).get('monte_carlo', {}).get('eta_percentiles')}")
    cost_savings = res.get('agents', {}).get('cost', {}).get('net_financial_savings_usd', 0.0)
    if isinstance(cost_savings, dict):
        cost_savings = cost_savings.get('value', 0.0)
    print(f"Reconciled Loss Avoided: ${float(cost_savings):,.2f} USD")
    print(f"Model Provenance Active Models: {list(res.get('model_provenance', {}).keys())}")

if __name__ == "__main__":
    asyncio.run(main())
