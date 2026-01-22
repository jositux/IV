export interface DocumentUploadResponse {
  success: boolean
  data: {
    id: string
    name: string
    extractedText: string
    status: string
  }
}

export interface DocumentUploadOptions {
  userId: string
  saveToS3?: boolean
  isPrimaryFocus?: boolean
}

export interface DocumentUrlUploadOptions {
  url: string
  userId: string
  saveToS3?: boolean
  isPrimaryFocus?: boolean
}

/**
 * Sube un documento desde un archivo y extrae su texto
 * @param token - JWT token de autenticación
 * @param file - Archivo a subir
 * @param options - Opciones de subida (userId, saveToS3, isPrimaryFocus)
 */
export const uploadDocument = async (
  token: string,
  file: File,
  options: DocumentUploadOptions,
): Promise<DocumentUploadResponse> => {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("userId", options.userId)
  formData.append("saveToS3", String(options.saveToS3 ?? true))
  formData.append("isPrimaryFocus", String(options.isPrimaryFocus ?? false))

  const response = await fetch("/gateway/documents/upload", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })

  if (!response.ok) {
    throw new Error(`Error ${response.status}: No se pudo subir el documento`)
  }

  return response.json()
}

/**
 * Sube un documento desde una URL y extrae su texto
 * @param token - JWT token de autenticación
 * @param options - Opciones de subida (url, userId, saveToS3, isPrimaryFocus)
 */
export const uploadDocumentFromUrl = async (
  token: string,
  options: DocumentUrlUploadOptions,
): Promise<DocumentUploadResponse> => {
  const response = await fetch("/gateway/documents/upload", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url: options.url,
      userId: options.userId,
      saveToS3: options.saveToS3 ?? true,
      isPrimaryFocus: options.isPrimaryFocus ?? false,
    }),
  })

  if (!response.ok) {
    throw new Error(`Error ${response.status}: No se pudo subir el documento desde URL`)
  }

  return response.json()
}
