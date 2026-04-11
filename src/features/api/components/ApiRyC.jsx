// src/features/api/ApiRyC.jsx
import { useState, useEffect } from 'react'
import axios from 'axios'

export const ApiRyC = () => {
  const [characters, setCharacters] = useState([])
  const [page, setPage] = useState(1)
  const [info, setInfo] = useState({})
  const [query, setQuery] = useState("")

  useEffect(() => {
    const source = axios.CancelToken.source()

    axios
      .get("https://rickandmortyapi.com/api/character/", {
        params: { page, name: query },
        cancelToken: source.token,
      })
      .then(({ data }) => {
        setCharacters(data.results || [])
        setInfo(data.info || {})
      })
      .catch((err) => {
        if (axios.isCancel(err)) return
        if (err.response?.status === 404) {
          setCharacters([])
          setInfo({})
          return
        }
        console.error(err)
      })

    return () => source.cancel()
  }, [page, query])

  return (
    <div className="container py-4">

      {/* Buscador */}
      <div className="row justify-content-center mb-4">
        <div className="col-md-6">
          <div className="input-group">
            <span className="input-group-text">🔍</span>
            <input
              type="text"
              className="form-control"
              placeholder="Buscar personaje..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setPage(1)
              }}
            />
          </div>
        </div>
      </div>

      {/* Paginación arriba */}
      <div className="d-flex justify-content-center align-items-center gap-3 mb-4">
        <button
          className="btn btn-outline-dark"
          disabled={!info?.prev}
          onClick={() => setPage(page - 1)}
        >
          ← Anterior
        </button>
        <span className="fw-bold">Página {page} de {info?.pages ?? "..."}</span>
        <button
          className="btn btn-outline-dark"
          disabled={!info?.next}
          onClick={() => setPage(page + 1)}
        >
          Siguiente →
        </button>
      </div>

      {/* Cards 3x3 */}
      {characters.length === 0 ? (
        <div className="text-center text-muted py-5">
          <h5>No se encontraron personajes.</h5>
        </div>
      ) : (
            <div className="row g-4 justify-content-center mx-auto" style={{ maxWidth: "960px" }}>
        {characters.slice(0, 6).map((char) => (
            <div className="col-4" key={char.id}>
            
              <div className="card h-100 shadow-sm text-center">
                <img
                  src={char.image}
                  alt={char.name}
                  className="card-img-top"
                  style={{ 
                    objectFit: "contain", 
                    height: "250px",
                    backgroundColor: "#f8f9fa"
                  }}
                />
                <div className="card-body">
                  <h5 className="card-title fw-bold">{char.name}</h5>
                  <span className={`badge ${
                    char.status === "Alive" ? "bg-danger" :  // ← Rojo
                    char.status === "Dead" ? "bg-dark" : "bg-secondary"
                  }`}>
                    {char.status}
                  </span>
                  <p className="card-text mt-2 text-muted">{char.species}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Paginación abajo */}
      <div className="d-flex justify-content-center align-items-center gap-3 mt-4">
        <button
          className="btn btn-outline-dark"
          disabled={!info?.prev}
          onClick={() => setPage(page - 1)}
        >
          ← Anterior
        </button>
        <span className="fw-bold">Página {page} de {info?.pages ?? "..."}</span>
        <button
          className="btn btn-outline-dark"
          disabled={!info?.next}
          onClick={() => setPage(page + 1)}
        >
          Siguiente →
        </button>
      </div>

    </div>
  )
}