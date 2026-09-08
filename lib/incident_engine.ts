export type EquipmentState = 'operativo' | 'advertencia' | 'caído'
export type AlertSeverity = 'info' | 'warning' | 'critical'
export type IncidentStatus = 'activa' | 'diagnostico' | 'resuelta'

export interface Equipment {
  id: string
  nombre: string
  tipo: 'router' | 'olt'
  estado: EquipmentState
  ip: string
  uptime: number // horas
  latencia: number // ms
  jitter: number // ms
  perdidaPaquetes: number // %
  ultimaIncidencia?: string
}

export interface Alert {
  id: string
  equipoId: string
  equipoNombre: string
  severidad: AlertSeverity
  mensaje: string
  timestamp: number
  status: IncidentStatus
  diagnosticoInicio?: number
  resolucion?: number
}

export interface Incident {
  id: string
  equipoId: string
  causa: string
  mttd: number // minutos
  mttr: number // minutos
  estado: IncidentStatus
}

export const equipmentMock: Equipment[] = [
  {
    id: 'r1',
    nombre: 'Router Core Sector A',
    tipo: 'router',
    estado: 'operativo',
    ip: '192.168.1.1',
    uptime: 720,
    latencia: 25,
    jitter: 2,
    perdidaPaquetes: 0,
  },
  {
    id: 'r2',
    nombre: 'Router Distribución Zona Norte',
    tipo: 'router',
    estado: 'operativo',
    ip: '192.168.1.2',
    uptime: 650,
    latencia: 35,
    jitter: 3,
    perdidaPaquetes: 0.1,
  },
  {
    id: 'r3',
    nombre: 'Router Acceso Sector B',
    tipo: 'router',
    estado: 'operativo',
    ip: '192.168.1.3',
    uptime: 480,
    latencia: 45,
    jitter: 5,
    perdidaPaquetes: 0.2,
  },
  {
    id: 'olt1',
    nombre: 'OLT GPON Hub Central',
    tipo: 'olt',
    estado: 'operativo',
    ip: '10.0.1.10',
    uptime: 800,
    latencia: 12,
    jitter: 1,
    perdidaPaquetes: 0,
  },
  {
    id: 'olt2',
    nombre: 'OLT GPON Sector Sur',
    tipo: 'olt',
    estado: 'operativo',
    ip: '10.0.1.11',
    uptime: 600,
    latencia: 18,
    jitter: 2,
    perdidaPaquetes: 0.1,
  },
  {
    id: 'r4',
    nombre: 'Router Respaldo Este',
    tipo: 'router',
    estado: 'operativo',
    ip: '192.168.1.4',
    uptime: 240,
    latencia: 55,
    jitter: 7,
    perdidaPaquetes: 0.3,
  },
  {
    id: 'olt3',
    nombre: 'OLT GPON Poniente',
    tipo: 'olt',
    estado: 'operativo',
    ip: '10.0.1.12',
    uptime: 500,
    latencia: 22,
    jitter: 3,
    perdidaPaquetes: 0.2,
  },
  {
    id: 'r5',
    nombre: 'Router Core Redundancia',
    tipo: 'router',
    estado: 'operativo',
    ip: '192.168.1.5',
    uptime: 720,
    latencia: 28,
    jitter: 2,
    perdidaPaquetes: 0,
  },
  {
    id: 'r6',
    nombre: 'Router Periferia Zona Oeste',
    tipo: 'router',
    estado: 'operativo',
    ip: '192.168.1.6',
    uptime: 360,
    latencia: 62,
    jitter: 8,
    perdidaPaquetes: 0.4,
  },
  {
    id: 'olt4',
    nombre: 'OLT GPON Crecimiento',
    tipo: 'olt',
    estado: 'operativo',
    ip: '10.0.1.13',
    uptime: 120,
    latencia: 35,
    jitter: 5,
    perdidaPaquetes: 0.5,
  },
]

export class IncidentEngine {
  private alerts: Map<string, Alert> = new Map()
  private incidents: Incident[] = []
  private alertIdCounter = 0

  simulateFault(equipmentId: string, equipmentName: string): Alert {
    const severity = Math.random() > 0.5 ? 'warning' : 'critical'
    const severityLabel = severity === 'warning' ? 'Advertencia' : 'Falla crítica'

    const alert: Alert = {
      id: `alert-${++this.alertIdCounter}`,
      equipoId: equipmentId,
      equipoNombre: equipmentName,
      severidad: severity === 'warning' ? 'warning' : 'critical',
      mensaje: `${severityLabel} detectada en ${equipmentName}`,
      timestamp: Date.now(),
      status: 'activa',
    }

    this.alerts.set(alert.id, alert)
    return alert
  }

  startDiagnosis(alertId: string): Alert | null {
    const alert = this.alerts.get(alertId)
    if (!alert) return null

    alert.status = 'diagnostico'
    alert.diagnosticoInicio = Date.now()
    this.alerts.set(alertId, alert)

    return alert
  }

  resolveIncident(alertId: string): Incident | null {
    const alert = this.alerts.get(alertId)
    if (!alert || !alert.diagnosticoInicio) return null

    alert.status = 'resuelta'
    alert.resolucion = Date.now()

    const mttd = Math.round((alert.diagnosticoInicio - alert.timestamp) / (1000 * 60))
    const mttr = Math.round((alert.resolucion - alert.diagnosticoInicio) / (1000 * 60))

    const incident: Incident = {
      id: alert.id,
      equipoId: alert.equipoId,
      causa: `Falla detectada en ${alert.equipoNombre}`,
      mttd: Math.max(mttd, 1),
      mttr: Math.max(mttr, 1),
      estado: 'resuelta',
    }

    this.incidents.push(incident)
    this.alerts.set(alertId, alert)

    return incident
  }

  getAlerts(): Alert[] {
    return Array.from(this.alerts.values())
  }

  getIncidents(): Incident[] {
    return this.incidents
  }

  calculateKPIs() {
    if (this.incidents.length === 0) {
      return { avgMttd: 0, avgMttr: 0 }
    }

    const totalMttd = this.incidents.reduce((sum, inc) => sum + inc.mttd, 0)
    const totalMttr = this.incidents.reduce((sum, inc) => sum + inc.mttr, 0)

    return {
      avgMttd: Math.round(totalMttd / this.incidents.length),
      avgMttr: Math.round(totalMttr / this.incidents.length),
    }
  }

  dismissAlert(alertId: string): void {
    this.alerts.delete(alertId)
  }
}
