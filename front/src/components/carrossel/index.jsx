import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import './style.css'

export function EmblaCarousel() {  
  const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay()])

  return (
    <div className="carrossel">
      <div className="embla" ref={emblaRef}>
        <div className="embla__container">
          <div className="embla__slide">
            <img src="http://localhost:3000/uploads/1738176221000-dirceu_rossa_1_-_copia.jpg" alt="" />
          </div>
          <div className="embla__slide">
            <img src="http://localhost:3000/uploads/1738156683047-20160409_110206_-_copia.jpg" alt="" />
          </div>
          <div className="embla__slide">
          <img src="http://localhost:3000/uploads/1738148450057-20170608_155020.jpg" alt="" />
          </div>
        </div>
      </div>
    </div>
  )
}