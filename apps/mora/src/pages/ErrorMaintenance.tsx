// src/pages/Errormaintenance.tsx
import ErrorLayout from '../layouts/ErrorLayout'

const errors = {
  "maintenance": {
    title: "Temporarily down for maintenance",
    description: "Sorry for the inconvenience but we’re performing some maintenance at the moment. We’ll be back online shortly!",
    illustration: "computer-fix"
  }
}

export default function ErrorMaintenance() {
  return <ErrorLayout errorCode="maintenance" errors={errors} />
}