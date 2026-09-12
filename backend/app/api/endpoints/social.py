from fastapi import APIRouter, HTTPException, Query
from typing import Dict, Any
from app.simulation.persona_generator import PersonaGenerator
from app.simulation.opinion_dynamics import OpinionDynamicsEngine

router = APIRouter()
persona_gen = PersonaGenerator()
opinion_engine = OpinionDynamicsEngine()

_CACHED_GRAPH: Dict[str, Any] = {}

@router.get("/network", response_model=Dict[str, Any])
async def get_social_network(sample_size: int = Query(75, ge=30, le=150)):
    cache_key = f"graph_{sample_size}"
    if cache_key not in _CACHED_GRAPH:
        personas = persona_gen.generate_population(population_size=1000)
        _CACHED_GRAPH[cache_key] = opinion_engine.build_network_graph(personas, sample_nodes=sample_size)
    return _CACHED_GRAPH[cache_key]

@router.get("/node/{node_id}", response_model=Dict[str, Any])
async def get_node_details(node_id: int):
    cache_key = "graph_75"
    if cache_key not in _CACHED_GRAPH:
        personas = persona_gen.generate_population(population_size=1000)
        _CACHED_GRAPH[cache_key] = opinion_engine.build_network_graph(personas, sample_nodes=75)

    graph = _CACHED_GRAPH[cache_key]
    nodes = graph["nodes"]
    if node_id < 0 or node_id >= len(nodes):
        raise HTTPException(status_code=404, detail=f"Node {node_id} not found in graph")

    node = nodes[node_id]
    edges = [e for e in graph["edges"] if e["source"] == node_id or e["target"] == node_id]

    return {
        "node": node,
        "connections": edges,
        "total_connections": len(edges),
        "social_propagation_summary": (
            f"{node['name']} ({node['segment']}) is an influential node with {len(edges)} connections "
            f"and influence score {node['influence_score']}. Over the 30-day run, their sentiment shifted from "
            f"{node['initial_opinion']} to {node['final_opinion']}."
        )
    }
