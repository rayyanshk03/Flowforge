"""
Maritime Database Seeder — FlowForge.

Populates PostgreSQL + PostGIS (and local SQLite fallback) with global container ports,
maritime shipping lane waypoints, and navigable sea corridor edges.
Applies GiST spatial indices and ST_SetSRID geography points.
"""
import logging
from sqlalchemy import text
from app.database.db import engine, SessionLocal, PortSpatialModel, MaritimeNodeModel, MaritimeEdgeModel
from app.services.port_registry import port_registry
from app.routing.maritime_graph import DEFAULT_MARITIME_NODES, DEFAULT_MARITIME_EDGES

logger = logging.getLogger("flowforge.database.seeder")

def seed_database():
    session = SessionLocal()
    try:
        # 1. Enable PostGIS extension if running PostgreSQL
        if "postgresql" in str(engine.url):
            try:
                session.execute(text("CREATE EXTENSION IF NOT EXISTS postgis;"))
                session.commit()
                logger.info("PostGIS extension enabled in PostgreSQL.")
            except Exception as e:
                logger.warning(f"Could not enable PostGIS extension: {e}")

        # 2. Seed Ports Table
        existing_ports_count = session.query(PortSpatialModel).count()
        if existing_ports_count == 0:
            logger.info("Seeding ports table...")
            all_ports = port_registry.list_all_ports()
            port_items = all_ports.values() if isinstance(all_ports, dict) else all_ports
            for p in port_items:
                port_obj = PortSpatialModel(
                    name=p["name"],
                    country=p["country"],
                    unlocode=p["unlocode"],
                    port_type="CONTAINER_PORT",
                    latitude=p["latitude"],
                    longitude=p["longitude"],
                    capacity=float(p.get("capacity", 500000.0)),
                    current_congestion=float(p.get("congestion_index", 0.30)),
                    geo_port_risk=float(p.get("geo_port_risk", 0.15))
                )
                session.add(port_obj)
            session.commit()

            # Update geometry columns if PostgreSQL + PostGIS
            if "postgresql" in str(engine.url):
                try:
                    session.execute(text("""
                        UPDATE ports
                        SET geom = ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography
                        WHERE geom IS NULL;
                    """))
                    session.execute(text("CREATE INDEX IF NOT EXISTS idx_ports_geom ON ports USING GIST (geom);"))
                    session.commit()
                    logger.info("Updated ports geometry & GiST index.")
                except Exception as e:
                    logger.warning(f"PostGIS geometry update error: {e}")

        # 3. Seed Maritime Nodes Table
        existing_nodes_count = session.query(MaritimeNodeModel).count()
        if existing_nodes_count == 0:
            logger.info("Seeding maritime_nodes table...")
            for n in DEFAULT_MARITIME_NODES:
                node_obj = MaritimeNodeModel(
                    node_id=n["node_id"],
                    name=n["name"],
                    node_type=n["type"],
                    latitude=n["lat"],
                    longitude=n["lon"]
                )
                session.add(node_obj)
            session.commit()

        # 4. Seed Maritime Edges Table
        existing_edges_count = session.query(MaritimeEdgeModel).count()
        if existing_edges_count == 0:
            logger.info("Seeding maritime_edges table...")
            for idx, e in enumerate(DEFAULT_MARITIME_EDGES, 1):
                edge_obj = MaritimeEdgeModel(
                    edge_id=idx,
                    source=e["source"],
                    target=e["target"],
                    name=e["name"],
                    distance_m=float(e.get("distance_m", 100000.0)),
                    base_speed_knots=float(e.get("base_speed_knots", 18.0)),
                    operational_stress=float(e.get("operational_stress", 0.1)),
                    geo_risk=float(e.get("geo_risk", 0.1)),
                    congestion=float(e.get("congestion", 0.1)),
                    navigable=True
                )
                session.add(edge_obj)
            session.commit()

        logger.info("Maritime database seeding completed successfully.")
    except Exception as e:
        session.rollback()
        logger.error(f"Error during maritime database seeding: {e}")
    finally:
        session.close()

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    seed_database()
