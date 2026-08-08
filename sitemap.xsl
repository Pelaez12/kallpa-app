<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" 
                xmlns:html="http://www.w3.org/TR/REC-html40"
                xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
                xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html lang="es">
      <head>
        <title>Sitemap XML | Kallpa &amp; Búnker Cross Jesús María</title>
        <meta charset="UTF-8"/>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0b0f19; color: #e2e8f0; margin: 0; padding: 30px; }
          .header { max-width: 900px; margin: 0 auto 30px auto; background: linear-gradient(135deg, #161f30 0%, #0e1524 100%); padding: 25px; border-radius: 12px; border: 1px solid rgba(0,210,255,0.2); }
          h1 { color: #00d2ff; margin: 0 0 10px 0; font-size: 1.8rem; display: flex; align-items: center; gap: 10px; }
          p { color: #94a3b8; margin: 0; font-size: 0.95rem; }
          table { width: 100%; max-width: 900px; margin: 0 auto; border-collapse: collapse; background: #161f30; border-radius: 12px; overflow: hidden; border: 1px solid rgba(255,255,255,0.08); }
          th { background: #1e293b; color: #00d2ff; text-align: left; padding: 14px 18px; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.5px; }
          td { padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 0.9rem; word-break: break-all; }
          tr:hover { background: rgba(0,210,255,0.05); }
          a { color: #38bdf8; text-decoration: none; font-weight: 600; }
          a:hover { text-decoration: underline; }
          .badge { display: inline-block; padding: 4px 8px; border-radius: 6px; font-size: 0.75rem; font-weight: bold; background: rgba(255,90,31,0.2); color: #ff5a1f; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>⚡ Mapa del Sitio XML (Sitemap Estratégico SEO)</h1>
          <p>Kallpa Triatlón &amp; Búnker Cross — Jesús María, Lima, Perú. Optimizado para Google Search y Google Maps.</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>URL del Recurso / Sección</th>
              <th>Frecuencia</th>
              <th>Prioridad</th>
              <th>Última Modificación</th>
            </tr>
          </thead>
          <tbody>
            <xsl:for-each select="sitemap:urlset/sitemap:url">
              <tr>
                <td>
                  <a href="{sitemap:loc}" target="_blank"><xsl:value-of select="sitemap:loc"/></a>
                  <xsl:if select="image:image">
                    <br/><span class="badge">📷 <xsl:value-of select="count(image:image)"/> Imágenes Indexadas</span>
                  </xsl:if>
                </td>
                <td><xsl:value-of select="sitemap:changefreq"/></td>
                <td><strong><xsl:value-of select="sitemap:priority"/></strong></td>
                <td><xsl:value-of select="sitemap:lastmod"/></td>
              </tr>
            </xsl:for-each>
          </tbody>
        </table>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
