import React, { useMemo, useState, useEffect } from 'react'
import CameraView from './CameraView'
import { MakeupModel } from '../models/MakeupModel'
import { CameraPresenter } from '../presenters/CameraPresenter'

export default function ARModal({ product, onClose }) {
  const [shades, setShades] = useState([])
  const [selectedShade, setSelectedShade] = useState(null)
  const [loading, setLoading] = useState(true)

  // Map UI product types to API route categories
  const toCategory = (t) => {
    switch ((t || '').toLowerCase()) {
      case 'lipstick':
        return 'lipsticks'
      case 'eyeliner':
        return 'eyeliners'
      case 'eyebrow':
      case 'eyebrows':
        return 'eyebrows'
      case 'blush':
        return 'blush'
      case 'eyeshadow':
      case 'eyeshadows':
        return 'eyeshadows'
      default:
        return (t || '').toLowerCase()
    }
  }

  // Fetch product shades from MongoDB
  useEffect(() => {
    const fetchShades = async () => {
      if (!product?._id) return
      
      try {
        setLoading(true)
        // Prefer BeautyBar shades endpoint for items coming from BeautyBar
        let response = await fetch(`${import.meta.env.VITE_API_URL}/api/beautybar/products/${product.productType}/${product._id}/shades`)
        // Fallback to generic products route if needed
        if (!response.ok) {
          const category = toCategory(product?.productType)
          response = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${category}/${product._id}/shades`)
        }
        const data = await response.json()
        
        if (data.success) {
          let list = Array.isArray(data.shades) ? data.shades : []
          console.log('📝 AR Debug - Product:', product?.name, 'Type:', product?.productType)
          console.log('📝 AR Debug - API Response:', data)
          console.log('📝 AR Debug - Shades from API:', list.length, list)
          
          if (list.length === 0) {
            const t = (product?.productType || '').toLowerCase()
            console.log('⚠️ AR Debug - No shades found, product type:', t)
            if (t === 'eyeliner') {
              list = [
                { name: 'Deep Black', hex: '#000000', rgba: 'rgba(0,0,0,0.95)' },
                { name: 'Brown', hex: '#6B4423', rgba: 'rgba(107,68,35,0.9)' },
                { name: 'Charcoal', hex: '#36454F', rgba: 'rgba(54,69,79,0.9)' }
              ]
              console.log('✅ AR Debug - Using eyeliner fallback shades')
            } else if (t === 'lipstick') {
              list = [
                { name: 'Classic Red', hex: '#D32F2A', rgba: 'rgba(211,47,42,0.7)' },
                { name: 'Nude Pink', hex: '#FFB6C1', rgba: 'rgba(255,182,193,0.6)' }
              ]
              console.log('✅ AR Debug - Using lipstick fallback shades')
            } else {
              console.log('⚠️ AR Debug - No fallback shades for type:', t)
            }
          }
          console.log('✅ AR shades loaded:', list.length, 'shades')
          setShades(list)
          // Set first shade as default
          if (list.length > 0) {
            setSelectedShade(list[0])
          }
        }
      } catch (error) {
        console.error('Error fetching shades:', error)
        // Fallback to product color if available
        if (product?.color) {
          setShades([{ name: product.color, hex: product.color, rgba: product.color }])
          setSelectedShade({ name: product.color, hex: product.color, rgba: product.color })
        }
      } finally {
        setLoading(false)
      }
    }

    fetchShades()
  }, [product])

  const { model, presenter } = useMemo(() => {
    const m = new MakeupModel()
    // Reset all features off by default
    m.setFeatureActive('lipstick', false)
    m.setFeatureActive('eyelash', false)
    m.setFeatureActive('eyebrow', false)
    m.setFeatureActive('blush', false)
    m.setFeatureActive('eyeshadow', false)

    const type = (product?.productType || '').toLowerCase()

    if (type === 'lipstick') {
      m.setFeatureActive('lipstick', true)
      // Use selected shade or fallback
      const color = selectedShade?.rgba || selectedShade?.hex || product?.color || 'rgba(211, 39, 42, 0.7)'
      m.setColor(color)
    } else if (type === 'eyeliner') {
      m.setFeatureActive('eyelash', true)
      // Create eyelash preset from product data
      const eyelashPreset = {
        name: product?.name || 'Eyeliner',
        color: selectedShade?.rgba || selectedShade?.hex || product?.color || 'rgba(0, 0, 0, 0.9)',
        length: 1.5,
        thickness: 1.2,
        curl: 0.7,
        softness: 0.5,
        opacity: 0.95
      }
      m.setEyelash(eyelashPreset)
    } else if (type === 'eyebrows' || type === 'eyebrow') {
      m.setFeatureActive('eyebrow', true)
      // Create eyebrow preset from product data
      const eyebrowPreset = {
        name: product?.name || 'Eyebrow',
        color: selectedShade?.rgba || selectedShade?.hex || product?.color || 'rgba(139, 69, 19, 0.8)',
        thickness: 1.0
      }
      m.setEyebrow(eyebrowPreset)
    } else if (type === 'blush') {
      m.setFeatureActive('blush', true)
      // Create blush preset from product data
      const blushPreset = {
        name: product?.name || 'Blush',
        color: selectedShade?.rgba || selectedShade?.hex || product?.color || 'rgba(255, 218, 185, 0.4)',
        intensity: 0.35
      }
      m.setBlush(blushPreset)
    } else if (type === 'eyeshadow' || type === 'eyeshadows') {
      m.setFeatureActive('eyeshadow', true)
      // Create eyeshadow preset from product data
      const eyeshadowPreset = {
        name: product?.name || 'Eyeshadow',
        color: selectedShade?.rgba || selectedShade?.hex || product?.color || 'rgba(198, 120, 110, 0.28)',
        intensity: 0.35,
        softness: 5,
        blendMode: 'soft-light',
        opacity: 0.85
      }
      m.setEyeshadow(eyeshadowPreset)
    } else {
      // Default to lipstick demo
      m.setFeatureActive('lipstick', true)
      const color = selectedShade?.rgba || selectedShade?.hex || product?.color || 'rgba(211, 39, 42, 0.7)'
      m.setColor(color)
    }

    const p = new CameraPresenter(m, {})

    return { model: m, presenter: p }
  }, [product, selectedShade])

  const onReady = useMemo(() => presenter.createCallback(), [presenter])

  const handleShadeSelect = (shade) => {
    setSelectedShade(shade)
    // Live update without recreating presenter/camera
    const type = (product?.productType || '').toLowerCase()
    if (type === 'lipstick') {
      const color = shade?.rgba || shade?.hex
      if (color) model.setColor(color)
    } else if (type === 'eyeliner') {
      const preset = {
        name: product?.name || 'Eyeliner',
        color: shade?.rgba || shade?.hex || 'rgba(0,0,0,0.95)',
        length: model.getEyelash()?.length || 1.5,
        thickness: model.getEyelash()?.thickness || 1.2,
        curl: model.getEyelash()?.curl || 0.7,
        softness: model.getEyelash()?.softness || 0.5,
        opacity: model.getEyelash()?.opacity || 0.95
      }
      model.setEyelash(preset)
    } else if (type === 'eyebrows' || type === 'eyebrow') {
      const preset = {
        name: product?.name || 'Eyebrow',
        color: shade?.rgba || shade?.hex || 'rgba(139,69,19,0.8)',
        thickness: model.getEyebrow()?.thickness || 1.0
      }
      model.setEyebrow(preset)
    } else if (type === 'blush') {
      const preset = {
        name: product?.name || 'Blush',
        color: shade?.rgba || shade?.hex || 'rgba(255,218,185,0.4)',
        intensity: model.getBlush()?.intensity || 0.35
      }
      model.setBlush(preset)
    } else if (type === 'eyeshadow' || type === 'eyeshadows') {
      const preset = {
        name: product?.name || 'Eyeshadow',
        color: shade?.rgba || shade?.hex || 'rgba(198,120,110,0.28)',
        intensity: model.getEyeshadow()?.intensity || 0.35,
        softness: model.getEyeshadow()?.softness || 5,
        blendMode: model.getEyeshadow()?.blendMode || 'soft-light',
        opacity: model.getEyeshadow()?.opacity || 0.85
      }
      model.setEyeshadow(preset)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-xl w-[95vw] max-w-[980px] p-0 md:p-2">
        <div className="flex items-center justify-between px-4 pt-3 pb-2">
          <div>
            <h3 className="text-lg font-semibold">Try AR</h3>
            <p className="text-sm text-gray-500">{product?.name}</p>
          </div>
          <button onClick={onClose} className="px-3 py-2 rounded-md border hover:bg-gray-50 text-sm">
            Close
          </button>
        </div>

        <div className="w-full px-2 pb-32 md:pb-36">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
            </div>
          ) : (
            <CameraView onReady={onReady} />
          )}
        </div>

        {/* Bottom shades tray */}
        {!loading && (
          <div className="absolute left-0 right-0 bottom-3 md:bottom-4 px-3">
            {shades.length > 0 ? (
              <div className="mx-auto max-w-[920px] rounded-2xl bg-white/90 backdrop-blur shadow-xl border border-gray-200">
                <div className="p-3">
                  <div className="flex gap-2 overflow-x-auto no-scrollbar">
                    {shades.map((shade, index) => (
                      <button
                        key={index}
                        onClick={() => handleShadeSelect(shade)}
                        className={`shrink-0 flex flex-col items-center justify-center w-24 rounded-xl border transition-all px-2 py-2 ${
                          selectedShade === shade ? 'border-pink-500 bg-pink-50' : 'border-gray-200 hover:border-pink-300'
                        }`}
                      >
                        <span
                          className="block w-10 h-10 rounded-full border"
                          style={{ backgroundColor: shade.hex || shade.rgba }}
                        />
                        <span className="mt-2 text-xs font-medium text-gray-700 text-center line-clamp-2">
                          {shade.name || `Shade ${index + 1}`}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="mx-auto max-w-[920px] rounded-2xl bg-white/90 backdrop-blur shadow-xl border border-gray-200">
                <div className="p-3 text-center">
                  <p className="text-sm text-gray-500">
                    This product doesn't have color variations in our database yet.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}


