import { useState } from 'react'
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore'
import { db } from './Components/Firebase/firebase'

function TestFb() {

    // ── GUARDAR ──────────────────────────────────────
    const [nombre, setNombre] = useState('')
    const [descripcion, setDescripcion] = useState('')
    const [estadoGuardar, setEstadoGuardar] = useState<'idle' | 'guardando' | 'exito' | 'error'>('idle')

    const guardarDocumento = async () => {
        if (!nombre.trim()) return
        setEstadoGuardar('guardando')
        try {
            const docRef = await addDoc(collection(db, 'test'), {
                nombre,
                descripcion,
                creadoEn: new Date()
            })
            console.log('Documento guardado con ID:', docRef.id)
            setEstadoGuardar('exito')
            setNombre('')
            setDescripcion('')
        } catch (error) {
            console.error('Error al guardar:', error)
            setEstadoGuardar('error')
        }
    }

    // ── CONSULTA EXACTA ───────────────────────────────
    const [busqueda, setBusqueda] = useState('')
    const [resultados, setResultados] = useState<object[] | null>(null)
    const [estadoConsulta, setEstadoConsulta] = useState<'idle' | 'buscando' | 'error'>('idle')

    const consultarDocumentos = async () => {
        if (!busqueda.trim()) return
        setEstadoConsulta('buscando')
        setResultados(null)
        try {
            const q = query(collection(db, 'test'), where('nombre', '==', busqueda.trim()))
            const snapshot = await getDocs(q)
            console.log(snapshot.docs[0].data().creadoEn.toDate())
            setResultados(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
            setEstadoConsulta('idle')
        } catch (error) {
            console.error('Error al consultar:', error)
            setEstadoConsulta('error')
        }
    }

    // ── CONSULTA OR (dos nombres) ─────────────────────
    const [nombreOr1, setNombreOr1] = useState('')
    const [nombreOr2, setNombreOr2] = useState('')
    const [resultadosOr, setResultadosOr] = useState<object[] | null>(null)
    const [estadoOr, setEstadoOr] = useState<'idle' | 'buscando' | 'error'>('idle')

    const consultarOR = async () => {
        const valores = [nombreOr1.trim(), nombreOr2.trim()].filter(Boolean)
        if (valores.length === 0) return
        setEstadoOr('buscando')
        setResultadosOr(null)
        try {
            const q = query(collection(db, 'test'), where('nombre', 'in', valores))
            const snapshot = await getDocs(q)
            setResultadosOr(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
            setEstadoOr('idle')
        } catch (error) {
            console.error('Error al consultar OR:', error)
            setEstadoOr('error')
        }
    }

    // ── ESTILOS ───────────────────────────────────────
    const preStyle: React.CSSProperties = {
        background: '#1e1e1e',
        color: '#d4d4d4',
        padding: '1rem',
        borderRadius: '6px',
        overflowX: 'auto',
        fontSize: '0.85rem'
    }
    const inputStyle: React.CSSProperties = { padding: '0.5rem', fontSize: '1rem' }
    const btnStyle: React.CSSProperties = { padding: '0.5rem 1rem', fontSize: '1rem', cursor: 'pointer' }

    return (
        <div style={{ padding: '2rem', maxWidth: '500px', margin: '0 auto', fontFamily: 'sans-serif' }}>

            {/* ── GUARDAR ── */}
            <h1>Guardar en Firebase</h1>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <input type="text" placeholder="Nombre" value={nombre}
                    onChange={e => setNombre(e.target.value)} style={inputStyle} />
                <textarea placeholder="Descripción" value={descripcion}
                    onChange={e => setDescripcion(e.target.value)} rows={3} style={inputStyle} />
                <button onClick={guardarDocumento}
                    disabled={estadoGuardar === 'guardando' || !nombre.trim()} style={btnStyle}>
                    {estadoGuardar === 'guardando' ? 'Guardando...' : 'Guardar'}
                </button>
                {estadoGuardar === 'exito' && <p style={{ color: 'green' }}>✅ Guardado exitosamente</p>}
                {estadoGuardar === 'error' && <p style={{ color: 'red' }}>❌ Error al guardar</p>}
            </div>

            <hr style={{ margin: '2rem 0' }} />

            {/* ── CONSULTA EXACTA ── */}
            <h2>Consultar por nombre (exacto)</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <input type="text" placeholder="Nombre exacto..." value={busqueda}
                    onChange={e => setBusqueda(e.target.value)} style={inputStyle} />
                <button onClick={consultarDocumentos}
                    disabled={estadoConsulta === 'buscando' || !busqueda.trim()} style={btnStyle}>
                    {estadoConsulta === 'buscando' ? 'Buscando...' : 'Consultar'}
                </button>
                {estadoConsulta === 'error' && <p style={{ color: 'red' }}>❌ Error al consultar</p>}
                {resultados !== null && <pre style={preStyle}>{JSON.stringify(resultados, null, 2)}</pre>}
            </div>

            <hr style={{ margin: '2rem 0' }} />

            {/* ── CONSULTA OR ── */}
            <h2>Consultar por dos nombres (OR)</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <input type="text" placeholder="Nombre 1" value={nombreOr1}
                    onChange={e => setNombreOr1(e.target.value)} style={inputStyle} />
                <input type="text" placeholder="Nombre 2" value={nombreOr2}
                    onChange={e => setNombreOr2(e.target.value)} style={inputStyle} />
                <button onClick={consultarOR}
                    disabled={estadoOr === 'buscando' || (!nombreOr1.trim() && !nombreOr2.trim())} style={btnStyle}>
                    {estadoOr === 'buscando' ? 'Buscando...' : 'Consultar OR'}
                </button>
                {estadoOr === 'error' && <p style={{ color: 'red' }}>❌ Error al consultar</p>}
                {resultadosOr !== null && <pre style={preStyle}>{JSON.stringify(resultadosOr, null, 2)}</pre>}
            </div>

        </div>
    )
}

export default TestFb