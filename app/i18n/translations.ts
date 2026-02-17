export type Language = 'es' | 'en' | 'pt'

export interface Translations {
  header: {
    title: string
    subtitle: string
  }
  terminal: {
    placeholder: string
    help: string
    unknownCommand: string
  }
  commands: {
    moveLeft: string
    moveRight: string
    jump: string
    greet: string
    shrug: string
    pickObject: string
  }
  commandExamples: string
  robot: {
    idle: string
    moving: string
    acting: string
    confused: string
  }
  language: string
}

export const translations: Record<Language, Translations> = {
  es: {
    header: {
      title: 'Interfaz de Robot Pixel',
      subtitle: 'Escribe un comando para interactuar con el robot',
    },
    terminal: {
      placeholder: 'Escribe un comando... (izquierda, derecha, saltar, hola)',
      help: 'Comandos disponibles: izquierda, derecha, saltar, hola, shrug',
      unknownCommand: 'Comando desconocido',
    },
    commands: {
      moveLeft: 'Mover izquierda',
      moveRight: 'Mover derecha',
      jump: 'Saltar',
      greet: 'Saludar',
      shrug: 'Encoger de hombros',
      pickObject: 'Agarrar objeto',
    },
    commandExamples: 'izquierda, derecha, saltar, hola, shrug',
    robot: {
      idle: 'Inactivo',
      moving: 'Moviendo',
      acting: 'Actuando',
      confused: 'Confundido',
    },
    language: 'Español',
  },
  en: {
    header: {
      title: 'Pixel Robot Interface',
      subtitle: 'Type a command to interact with the robot',
    },
    terminal: {
      placeholder: 'Type a command... (left, right, jump, hello)',
      help: 'Available commands: left, right, jump, hello, shrug',
      unknownCommand: 'Unknown command',
    },
    commands: {
      moveLeft: 'Move left',
      moveRight: 'Move right',
      jump: 'Jump',
      greet: 'Greet',
      shrug: 'Shrug',
      pickObject: 'Pick object',
    },
    commandExamples: 'left, right, jump, hello, shrug',
    robot: {
      idle: 'Idle',
      moving: 'Moving',
      acting: 'Acting',
      confused: 'Confused',
    },
    language: 'English',
  },
  pt: {
    header: {
      title: 'Interface do Robô Pixel',
      subtitle: 'Digite um comando para interagir com o robô',
    },
    terminal: {
      placeholder: 'Digite um comando... (esquerda, direita, pular, olá)',
      help: 'Comandos disponíveis: esquerda, direita, pular, olá, encolher',
      unknownCommand: 'Comando desconhecido',
    },
    commands: {
      moveLeft: 'Mover à esquerda',
      moveRight: 'Mover à direita',
      jump: 'Pular',
      greet: 'Saudar',
      shrug: 'Encolher os ombros',
      pickObject: 'Pegar objeto',
    },
    commandExamples: 'esquerda, direita, pular, oi, encolher',
    robot: {
      idle: 'Inativo',
      moving: 'Movendo',
      acting: 'Atuando',
      confused: 'Confuso',
    },
    language: 'Português',
  },
}

export const getTranslation = (language: Language): Translations => {
  return translations[language] || translations.en
}
