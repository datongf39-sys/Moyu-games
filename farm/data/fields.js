const FarmFieldsData = {
  fields: Array(25).fill(null).map((_, i) => ({
    id: i,
    crop: null,
    progress: 0,
    pest: false,
    quality: 1
  }))
}

window.FarmFieldsData = FarmFieldsData
