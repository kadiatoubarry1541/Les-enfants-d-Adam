import { useEffect, useMemo, useState } from 'react'
import { useI18n } from '../i18n/useI18n'

interface DonationEntry {
  id: string
  date: string
  amount: number
  message: string
}

export function Donations() {
  const { t } = useI18n()
  const STORAGE_KEY = 'donations_log'
  const [entries, setEntries] = useState<DonationEntry[]>([])
  const [amount, setAmount] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) setEntries(JSON.parse(raw))
  }, [])

  const total = useMemo(() => entries.reduce((s, e) => s + (e.amount || 0), 0), [entries])

  const addEntry = () => {
    const value = parseFloat(amount)
    if (!value || value <= 0) return
    const entry: DonationEntry = {
      id: Math.random().toString(36).slice(2),
      date: new Date().toISOString(),
      amount: value,
      message: message.trim()
    }
    const next = [entry, ...entries]
    setEntries(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    setAmount('')
    setMessage('')
  }

  return (
    <div className="stack">
      <div className="card">
        <h1 className="text-2xl font-bold mb-2">{t('donations.title')}</h1>
        <p className="text-gray-600 mb-4">
          {t('donations.number')}: <span className="font-bold text-emerald-700">653621</span>
        </p>

        <div className="row items-end">
          <div className="col-3">
            <div className="field">
              <label>{t('donations.amount')}</label>
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="10000" />
            </div>
          </div>
          <div className="col-6">
            <div className="field">
              <label>{t('donations.message')}</label>
              <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Référence/expéditeur..." />
            </div>
          </div>
          <div className="col-3">
            <button className="btn" onClick={addEntry}>{t('donations.add')}</button>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-bold">Journal</h3>
          <div className="text-sm text-gray-600">Total: <span className="font-bold text-emerald-700">{total.toLocaleString()} GNF</span></div>
        </div>
        {entries.length === 0 ? (
          <div className="text-gray-500 text-center py-6">Aucune entrée</div>
        ) : (
          <div className="stack">
            {entries.map((e) => (
              <div key={e.id} className="card bg-gray-50">
                <div className="row">
                  <div className="col-3">
                    <div className="text-sm text-gray-500">{new Date(e.date).toLocaleString()}</div>
                  </div>
                  <div className="col-3 font-bold text-emerald-700">{e.amount.toLocaleString()} GNF</div>
                  <div className="col-6 text-gray-700">{e.message}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
