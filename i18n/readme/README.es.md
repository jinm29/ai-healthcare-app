# 🚀 **OpenHealth**

**Asistente de Salud con IA | Impulsado por tus datos, Ejecutado localmente**

---

<div align="center">

### 🌍 Elija su Idioma
[English](../../README.md) | [Français](README.fr.md) | [Deutsch](README.de.md) | [Español](README.es.md) | [한국어](README.ko.md) | [中文](README.zh.md) | [日本語](README.ja.md)

</div>

---

<p align="center">
  <img src="/intro/openhealth.gif" alt="Demo de OpenHealth">
</p>

## 🌟 Descripción General

> OpenHealth le ayuda a **tomar el control de sus datos de salud**. Aprovechando la IA y su información personal de salud,
> OpenHealth proporciona un asistente privado y de ejecución local que le ayuda a comprender y gestionar mejor su salud.

## ✨ Características del Proyecto

<details open>
<summary><b>Funcionalidades Principales</b></summary>

- 📊 **Entrada Centralizada de Datos de Salud:** Consolide fácilmente todos sus datos de salud en un solo lugar.
- 🛠️ **Análisis Inteligente:** Analiza automáticamente sus datos de salud y genera archivos de datos estructurados.
- 🤝 **Conversaciones Contextuales:** Utilice los datos estructurados como contexto para interacciones personalizadas con IA impulsada por GPT.

</details>

## 📥 Fuentes de Datos y Modelos de Lenguaje Compatibles

<table>
  <tr>
    <th>Fuentes de Datos Disponibles</th>
    <th>Modelos de Lenguaje Compatibles</th>
  </tr>
  <tr>
    <td>
      • Resultados de Análisis de Sangre<br>
      • Datos de Chequeo Médico<br>
      • Información Física Personal<br>
      • Historial Familiar<br>
      • Síntomas
    </td>
    <td>
      • LLaMA<br>
      • DeepSeek-V3<br>
      • GPT<br>
      • Claude<br>
      • Gemini
    </td>
  </tr>
</table>

## 🤔 Por Qué Creamos OpenHealth

> - 💡 **Su salud es su responsabilidad.**
> - ✅ La verdadera gestión de la salud combina **sus datos** + **inteligencia**, convirtiendo las percepciones en planes accionables.
> - 🧠 La IA actúa como una herramienta imparcial para guiarlo y apoyarlo en la gestión efectiva de su salud a largo plazo.

## 🗺️ Diagrama del Proyecto


graph LR
    A[Entrada de Datos] --> B[Procesamiento y Análisis]
    B --> C[Base de Datos Local]
    C --> D[Motor de IA]
    D --> E[Asistente de Salud]
    E --> F[Recomendaciones]
    F --> A
    style A fill:#ff7eb6,stroke:#ff2d7e,stroke-width:2px
    style B fill:#7afcff,stroke:#00b4ff,stroke-width:2px
    style C fill:#98fb98,stroke:#32cd32,stroke-width:2px
    style D fill:#ffa07a,stroke:#ff4500,stroke-width:2px
    style E fill:#dda0dd,stroke:#9370db,stroke-width:2px
    style F fill:#f0e68c,stroke:#bdb76b,stroke-width:2px


Entrada de datos de salud --> Módulo de análisis --> Archivos de datos estructurados --> Integración GPT

> **Nota:** La funcionalidad de análisis de datos está actualmente implementada en un servidor Python separado y está planificada su migración a TypeScript en el futuro.

## Comenzando

## ⚙️ Cómo Ejecutar OpenHealth

<details open>
<summary><b>Instrucciones de Instalación</b></summary>

1. **Clonar el Repositorio:**
   
   git clone https://github.com/OpenHealthForAll/open-health.git
   cd open-health
   

2. **Instalar Dependencias:**
   
   npm install
   

3. **Configuración del archivo .env:**

   Cree un archivo `.env` en la raíz del proyecto y agregue el siguiente contenido:
   
   DATABASE_URL="postgres://postgres:mysecretpassword@localhost:5432/open-health"
   OPENAI_API_KEY="your-openai-api-key"
   

4. **Configuración de PostgreSQL:**

   Ejecute PostgreSQL usando Docker:

   
   # Iniciar el contenedor de PostgreSQL
   docker run -p 5432:5432 --name open-health -e POSTGRES_PASSWORD=mysecretpassword -d postgres
   

   Verificar el estado del contenedor:
   
   docker ps
   

5. **Iniciar la aplicación:**
   
   npm run dev
</details>   ```