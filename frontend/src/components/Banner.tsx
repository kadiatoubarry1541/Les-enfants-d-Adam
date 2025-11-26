import { useI18n } from '../i18n/useI18n'

export function Banner() {
  const { t } = useI18n()
  return (
    <div className="bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-700 dark:to-emerald-700 text-white py-3 px-4 text-center">
      <strong className="text-lg">{t('banner.message')}</strong>
    </div>
  )
}


