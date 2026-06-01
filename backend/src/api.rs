use axum::{extract::State, Json};
use serde_json::{json, Value};
use crate::models::{AppState, FlightAnomaly, EvacuationRoute, AtmosphericData};

pub async fn health_check() -> Json<Value> {
    Json(json!({ "status": "ok", "service": "cleopatra-backend" }))
}

pub async fn get_anomalies(State(state): State<AppState>) -> Json<Vec<FlightAnomaly>> {
    let state = state.read().await;
    Json(state.flight_anomalies.clone())
}

pub async fn get_evacuation_routes(State(state): State<AppState>) -> Json<Vec<EvacuationRoute>> {
    let state = state.read().await;
    Json(state.evacuation_routes.clone())
}

pub async fn get_atmospheric_data(State(state): State<AppState>) -> Json<Vec<AtmosphericData>> {
    let state = state.read().await;
    Json(state.atmospheric_data.clone())
}
