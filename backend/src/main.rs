mod api;
mod models;
mod stats;
mod ingestion;

use axum::{routing::get, Router};
use std::net::SocketAddr;
use tower_http::cors::CorsLayer;
use tracing_subscriber;

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();

    // Initialize state
    let state = models::StateInner::new();

    // Start background ingestion tasks
    ingestion::start_ingestion(state.clone());

    let app = Router::new()
        .route("/health", get(api::health_check))
        .route("/api/stats/anomalies", get(api::get_anomalies))
        .route("/api/evacuation", get(api::get_evacuation_routes))
        .route("/api/atmospheric", get(api::get_atmospheric_data))
        .with_state(state)
        .layer(CorsLayer::permissive());

    let addr = SocketAddr::from(([0, 0, 0, 0], 8080));
    tracing::info!("Backend listening on {}", addr);

    let listener = tokio::net::TcpListener::bind(&addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
