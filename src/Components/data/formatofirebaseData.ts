
export const formatoFirebaseData = [
  {
    id: "1",
    nombreFormato: "Grúa Telescópica",
    version: "01",
    fechaCreacion: "2024-01-10",
    fechaActualizacion: "2024-05-15",
    fechaRevision: "2025-01-10",
    codigoSIG: "SIG-FR-001",
    numeralSIG: "PR-MT-01",
    estado: "ACTIVO",
    checklist: [
      {
        id: "horometroycombustible",
        nombre: "HOROMETRO Y COMBUSTIBLE",
        items: [
          { id: "horometroInicioDia", 
            nombre: "Horómetro inicio día", 
            tipo: "number",
            
          },
          { id: "horometroFinDia", 
            nombre: "Horómetro fin día", 
            tipo: "number",
            
          },
          { id: "tanqueoCombustible", 
            nombre: "Tanqueo combustible", 
            tipo: "number",
            
          },
          { id: "horometroTanqueo", 
            nombre: "Horómetro en tanqueo", 
            tipo: "number",
            
          },
          { id: "acpmInicioDia", 
            nombre: "ACPM inicio día", 
            tipo: "select",
            opciones: [
              "Vacío",
              "1/4",
              "1/2",
              "3/4",
              "Lleno"
            ],
            
          },
          { id: "acpmFinDia", 
            nombre: "ACPM fin día", 
            tipo: "select",
            opciones: [
              "Vacío",
              "1/4",
              "1/2",
              "3/4",
              "Lleno"
            ],
            
          },

        ],
      },
      {
        id: "motorybombahidraulica",
        nombre: "MOTOR Y BOMBA HIDRÁULICA",
        items: [
          { id: "nivelAceiteMotor", 
            nombre: "Nivel de aceite del motor", 
            tipo: "boolean" 
          },
          { id: "nivelCombustible", 
            nombre: "Nivel de combustible", 
            tipo: "boolean" 
          },
          { id: "nivelRefrigerante", 
            nombre: "Nivel de refrigerante", 
            tipo: "boolean" 
          },
        ],
      },
      {
        id: "estadoMecanico",
        nombre: "ESTADO MECANICO",
        items: [
          { id: "cilindrosHidraulicos", 
            nombre: "Cilindros hidráulicos", 
            tipo: "boolean" 
          },
          { id: "graseras", 
            nombre: "Graseras", 
            tipo: "boolean" 
          },
          { id: "estadoMandosControl", 
            nombre: "Estado general mandos de control (acelerador motor, control pistonasos, bombeo)", 
            tipo: "boolean" 
          },
          { id: "indicadoresManometros", 
            nombre: "Indicadores y manómetros", 
            tipo: "boolean" 
          },
        ],
      },
    ],
  },
  {
    id: "2",
    nombreFormato: "Vehiculo liviano",
    version: "02",
    fechaCreacion: "2024-02-20",
    fechaActualizacion: "2024-06-10",
    fechaRevision: "2025-02-20",
    codigoSIG: "SIG-FR-002",
    numeralSIG: "PR-MT-02",
    estado: "ACTIVO",
    checklist: [],
    modulos: [],
  },
  {
    id: "3",
    nombreFormato: "Montacargas",
    version: "01",
    fechaCreacion: "2024-03-05",
    fechaActualizacion: "2024-07-01",
    fechaRevision: "2025-03-05",
    codigoSIG: "SIG-FR-003",
    numeralSIG: "PR-MT-03",
    estado: "ACTIVO",
    checklist: [],
    modulos: [],
  },
];
