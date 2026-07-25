"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import { ArrowLeft } from "lucide-react";

export default function ProfileClient({ docente }: { docente: any }) {
  const charLayerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let charX = 0, charY = 0;
    let mouseX = 0, mouseY = 0;
    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      mouseY = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
    };

    const updateParallax = () => {
      const targetX = mouseX * 25;
      const targetY = mouseY * 15;
      
      charX += (targetX - charX) * 0.08; 
      charY += (targetY - charY) * 0.08;

      if (charLayerRef.current) {
        charLayerRef.current.style.transform = `translate(${charX}px, ${charY}px)`;
      }
      animationFrameId = requestAnimationFrame(updateParallax);
    };

    window.addEventListener("mousemove", handleMouseMove);
    animationFrameId = requestAnimationFrame(updateParallax);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Link href="/" className="absolute top-6 left-6 z-50 text-white/50 hover:text-white flex items-center gap-2 transition-colors">
        <ArrowLeft className="w-5 h-5" /> Volver
      </Link>

      <div 
        className={styles.canvasContainer}
        style={{ backgroundImage: `url('https://arequipamistipress.com/wp-content/uploads/2024/09/economia-unsa.jpg')` }}
      >
        <div className={styles.canvasDotOverlay}></div>
        <div className={`${styles.uiCornerBracket} ${styles.topLeft}`}></div>
        <div className={`${styles.uiCornerBracket} ${styles.bottomRight}`}></div>
        
        <div className={styles.nihilityBgText}>DOCENTE INVESTIGADOR</div>
        
        {/* PANEL IZQUIERDO (SCROLLABLE DATA) */}
        <section className={styles.leftPanel}>
          <div className={styles.heroQuoteHeader}>
            {docente.institucion}
            <span className={styles.quoteJp}>{docente.facultad}</span>
          </div>

          <div className={styles.mainTitleGroup}>
            <span className={styles.japaneseSub}>{docente.rol.toUpperCase()}</span>
            <h1 className={styles.mainKanji}>{docente.nombre.toUpperCase()}</h1>
            <h1 className={styles.mainKanji} style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', letterSpacing: '2px' }}>
              {docente.apellidos.toUpperCase()}
            </h1>
            <br />
            <div className={styles.numericBadge}>ORCID: {docente.orcid}</div>
            {docente.renacyt && <div className={styles.numericBadge} style={{ marginLeft: '10px' }}>RENACYT: {docente.renacyt}</div>}
          </div>

          {/* Biografía */}
          <div className={styles.glassCard}>
            <h3>Biografía</h3>
            <p>{docente.resumen}</p>
          </div>

          {/* Experiencia */}
          <div className={styles.glassCard}>
            <h3>Experiencia Laboral</h3>
            <ul className={styles.glassList}>
              {docente.experiencia.map((exp: any, i: number) => (
                <li key={i}>
                  <strong>{exp.cargo}</strong> <br/>
                  {exp.institucion} ({exp.inicio} - {exp.fin})
                </li>
              ))}
            </ul>
          </div>

          {/* Formación */}
          <div className={styles.glassCard}>
            <h3>Formación Académica</h3>
            <ul className={styles.glassList}>
              {docente.formacion.map((form: any, i: number) => (
                <li key={i}>
                  <strong>{form.titulo}</strong> <br/>
                  {form.centro} ({form.grado})
                </li>
              ))}
            </ul>
          </div>

           {/* Publicaciones */}
           <div className={styles.glassCard}>
            <h3>Producción Científica</h3>
            <ul className={styles.glassList}>
              {docente.publicaciones.map((pub: any, i: number) => (
                <li key={i}>
                  <strong>{pub.titulo}</strong> <br/>
                  {pub.tipo} - {pub.año}
                </li>
              ))}
            </ul>
          </div>

          {/* Proyectos */}
          {docente.proyectos && docente.proyectos.length > 0 && (
            <div className={styles.glassCard}>
              <h3>Proyectos de Investigación</h3>
              <ul className={styles.glassList}>
                {docente.proyectos.map((proj: any, i: number) => (
                  <li key={i}>
                    <strong>{proj.titulo}</strong> <br/>
                    {proj.inicio} - {proj.fin}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Propiedad Intelectual */}
          {docente.propiedadIntelectual && docente.propiedadIntelectual.length > 0 && (
            <div className={styles.glassCard}>
              <h3>Propiedad Intelectual</h3>
              <ul className={styles.glassList}>
                {docente.propiedadIntelectual.map((pi: any, i: number) => (
                  <li key={i}>
                    <strong>{pi.titulo}</strong> <br/>
                    {pi.tipo}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tesis Asesoradas */}
          {docente.tesisAsesoradas && docente.tesisAsesoradas.length > 0 && (
            <div className={styles.glassCard}>
              <h3>Tesis Asesoradas</h3>
              <ul className={styles.glassList}>
                {docente.tesisAsesoradas.map((tesis: any, i: number) => (
                  <li key={i}>
                    <strong>{tesis.tesistas}</strong> <br/>
                    {tesis.titulo} - {tesis.fecha}
                  </li>
                ))}
              </ul>
            </div>
          )}

        </section>

        {/* PANEL CENTRAL */}
        <section className={styles.centerPanel}>
          <div className={styles.artWindow}>
            <div className={styles.techOverlay}>
              <span>STATUS: ACTIVE</span>
              <span>DOCENTE: ACTIVO</span>
              <div className={styles.livePulseBar}></div>
            </div>
          </div>
          <div className={styles.characterRoot} ref={charLayerRef}>
            <Image 
              src="/brand/jose-zuzunaga.svg" 
              alt={docente.fullName} 
              width={800} 
              height={1000} 
              className={styles.characterImg}
              unoptimized
            />
          </div>
        </section>

        {/* PANEL DERECHO */}
        <aside className={styles.rightPanel}>
          <div className={styles.pillBox}>UNSA</div>
          <div className={styles.verticalTextWrap}>
            <span className={styles.vKanjiTitle}>INVESTIGACIÓN</span>
            <span className={styles.vLatinSub}>EXCELLENCE</span>
            <span className={styles.diamond}>✦</span>
            <span className={styles.vLatinSub}>ECONOMICS</span>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: '10px' }}>—</div>
            <p className={styles.microJapanese}>ACTUALIZADO {docente.fechaActualizacion}</p>
          </div>
        </aside>

      </div>
    </div>
  );
}
