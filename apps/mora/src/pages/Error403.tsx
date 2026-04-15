// src/pages/Error403.tsx
import ErrorLayout from '@/shared/layouts/ErrorLayout'

const errors = {
  "403": {
    title: "403",
    description: "We are sorry but you do not have permission to access this page",
    illustration: "403"
  }
}

export default function Error403() {
  return <ErrorLayout errorCode="403" errors={errors} />
}
