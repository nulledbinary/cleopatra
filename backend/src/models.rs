use serde::{Deserialize, Serialize};
use std::sync::Arc;
use tokio::sync::RwLock;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FlightAnomaly {
    pub callsign: String,
    pub lat: f64,
    pub lng: f64,
    pub reason: String,
    pub severity: u8,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EvacuationRoute {
    pub name: String,
    pub safe_zones: Vec<(f64, f64)>, // Polygon points
    pub risk_level: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AtmosphericData {
    pub lat: f64,
    pub lng: f64,
    pub pressure_hpa: f64,
    pub trend: String,
}

pub struct StateInner {
    pub flight_anomalies: Vec<FlightAnomaly>,
    pub evacuation_routes: Vec<EvacuationRoute>,
    pub atmospheric_data: Vec<AtmosphericData>,
}

pub type AppState = Arc<RwLock<StateInner>>;

impl StateInner {
    pub fn new() -> AppState {
        Arc::new(RwLock::new(StateInner {
            flight_anomalies: Vec::new(),
            evacuation_routes: Vec::new(),
            atmospheric_data: Vec::new(),
        }))
    }
}
