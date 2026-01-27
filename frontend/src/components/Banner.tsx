import { useI18n } from '../i18n/useI18n'

export function Banner() {
  const { t } = useI18n()
  return (
    <div className="bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-700 dark:to-emerald-700 text-white py-2.5 xs:py-3 px-3 xs:px-4 text-center safe-area-inset-top">
      <strong className="text-sm xs:text-base sm:text-lg">{t('banner.message')}</strong>
    </div>
  )
}


