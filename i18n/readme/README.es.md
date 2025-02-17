# 🚀 **OpenHealth**

**Asistente de Salud con IA | Impulsado por tus datos, Ejecutado localmente**

<div align="center">

<p align="center">
  <img src="https://img.shields.io/badge/Platform-Web-blue?style=for-the-badge" alt="Platform">
  <img src="https://img.shields.io/badge/Language-TypeScript-blue?style=for-the-badge" alt="Language">
  <img src="https://img.shields.io/badge/Framework-Next.js-black?style=for-the-badge" alt="Framework">
</p>

> **📢 ¡Ahora Disponible en Versión Web!**  
> En respuesta a las solicitudes de acceso más fácil, hemos lanzado una versión web.  
> Pruébalo ahora: **[open-health.me](https://open-health.me/)**

### 🌍 Elija su Idioma
[English](../../README.md) | [Français](README.fr.md) | [Deutsch](README.de.md) | [Español](README.es.md) | [한국어](README.ko.md) | [中文](README.zh.md) | [日本語](README.ja.md) | [Українська](README.uk.md)

</div>

---

<p align="center">
  <img src="/intro/openhealth.avif" alt="Demo de OpenHealth">
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


```mermaid
graph LR
    subgraph Fuentes de Datos de Salud
        A1[Registros Clínicos<br>Análisis de Sangre/Diagnósticos/<br>Recetas/Imágenes]
        A2[Plataformas de Salud<br>Apple Health/Google Fit]
        A3[Dispositivos Portátiles<br>Oura/Whoop/Garmin]
        A4[Registros Personales<br>Dieta/Síntomas/<br>Historia Familiar]
    end

    subgraph Procesamiento de Datos
        B1[Analizador y Estandarización<br>de Datos]
        B2[Formato Unificado de<br>Datos de Salud]
    end

    subgraph Integración de IA
        C1[Procesamiento LLM<br>Modelos Comerciales y Locales]
        C2[Métodos de Interacción<br>RAG/Cache/Agentes]
    end

    A1 & A2 & A3 & A4 --> B1
    B1 --> B2
    B2 --> C1
    C1 --> C2

    style A1 fill:#e6b3cc,stroke:#cc6699,stroke-width:2px,color:#000
    style A2 fill:#b3d9ff,stroke:#3399ff,stroke-width:2px,color:#000
    style A3 fill:#c2d6d6,stroke:#669999,stroke-width:2px,color:#000
    style A4 fill:#d9c3e6,stroke:#9966cc,stroke-width:2px,color:#000
    
    style B1 fill:#c6ecd9,stroke:#66b399,stroke-width:2px,color:#000
    style B2 fill:#c6ecd9,stroke:#66b399,stroke-width:2px,color:#000
    
    style C1 fill:#ffe6cc,stroke:#ff9933,stroke-width:2px,color:#000
    style C2 fill:#ffe6cc,stroke:#ff9933,stroke-width:2px,color:#000

    classDef default color:#000
```


Entrada de datos de salud --> Módulo de análisis --> Archivos de datos estructurados --> Integración GPT

> **Nota:** La funcionalidad de análisis de datos está actualmente implementada en un servidor Python separado y está planificada su migración a TypeScript en el futuro.

## Comenzando

## ⚙️ Cómo ejecutar OpenHealth

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/OpenHealthForAll/open-health.git
   cd open-health
   ```

2. **Configuración y Ejecución:**
   ```bash
   # Copiar el archivo de entorno
   cp .env.example .env

   # Agregar claves API al archivo .env:
   # UPSTAGE_API_KEY - Para el análisis (Obtenga $10 de crédito sin registro de tarjeta en https://www.upstage.ai)
   # OPENAI_API_KEY - Para capacidades mejoradas de análisis

   # Iniciar la aplicación con Docker Compose
   docker compose --env-file .env up
   ```

   Para usuarios existentes:
   ```bash
   docker compose --env-file .env up --build
   ```

3. **Acceder a OpenHealth:**
   Abra su navegador y vaya a `http://localhost:3000` para comenzar a usar OpenHealth.

> **Nota:** El sistema consta de dos componentes principales: análisis y LLM. Actualmente, el análisis utiliza las API de Upstage y OpenAI (que mostraron el mejor rendimiento en nuestras pruebas), con un analizador local próximamente, mientras que el componente LLM puede ejecutarse completamente de forma local usando Ollama.

> **Nota:** Si está usando Ollama con Docker, asegúrese de configurar el punto final de la API de Ollama como: `http://docker.for.mac.localhost:11434/`

## 🌐 Comunidad y Soporte

<div align="center">

### 💫 Comparte tu Historia y Mantente Actualizado
[![AIDoctor Subreddit](https://img.shields.io/badge/r/AIDoctor-FF4500?style=for-the-badge&logo=reddit&logoColor=white)](https://www.reddit.com/r/AIDoctor/)
[![Discord](https://img.shields.io/badge/Discord-7289DA?style=for-the-badge&logo=discord&logoColor=white)](https://discord.gg/B9K654g4wf)

### 📬 Contacto
[![Reddit](https://img.shields.io/badge/Reddit-FF4500?style=for-the-badge&logo=reddit&logoColor=white)](https://www.reddit.com/user/Dry_Steak30/)

</div>

---
