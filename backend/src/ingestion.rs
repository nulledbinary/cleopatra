use crate::models::AppState;
use std::time::Duration;
use tokio::time;
use crate::stats;

pub fn start_ingestion(state: AppState) {
    let anomaly_state = state.clone();
    tokio::spawn(async move {
        let mut interval = time::interval(Duration::from_secs(60));
        loop {
            interval.tick().await;
            // Simulated fetch & statistical analysis
            let new_anomalies = stats::detect_flight_anomalies().await;
            let mut w = anomaly_state.write().await;
            w.flight_anomalies = new_anomalies;
        }
    });

    let evac_state = state.clone();
    tokio::spawn(async move {
        let mut interval = time::interval(Duration::from_secs(300));
        loop {
            interval.tick().await;
            let routes = stats::generate_evacuation_routes().await;
            let mut w = evac_state.write().await;
            w.evacuation_routes = routes;
        }
    });

    let atmos_state = state.clone();
    tokio::spawn(async move {
        let mut interval = time::interval(Duration::from_secs(120));
        loop {
            interval.tick().await;
            let data = stats::analyze_atmospheric_pressure().await;
            let mut w = atmos_state.write().await;
            w.atmospheric_data = data;
        }
    });
}
