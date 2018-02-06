module.exports = (app) => {
  const keywordLinter = (s) => {
    if (!s) { return false }
    let x,
      y,
      word,
      stop_word,
      regex_str,
      regex

    const stop_words = [
      'a',
      'e',
      'i',
      'o',
      'u',
      'á',
      'é',
      'í',
      'ó',
      'ú',
      'à',
      'è',
      'ì',
      'ò',
      'ù',
      'de',
      'da',
      'na',
      'no',
      'em',
      'as',
      'os',
      'ou',
      'para',
      'pra',
      'pro',
      'por',
      'um',
      'aa',
      'ee',
      'ii',
      'oo',
      'uu',
      'uma',
      'uns',
      'umas',
      'este',
      'esse',
      'aquele',
      'como',
      'meu',
      'teu',
      'seu',
      'minha',
      'nosso',
      'vosso',
      'algum',
      'nenhum',
      'todo',
      'muito',
      'pouco',
      'tanto',
      'outro',
      'certo',
      'qualquer',
      'cada',
      'eu',
      'tu',
      'você',
      'ele',
      'ela',
      'nós',
      'vós',
      'vocês',
      'eles',
      'elas',
      'tal',
      'ante',
      'após',
      'apos',
      'até',
      'ate',
      'com',
      'contra',
      'de',
      'desde',
      'entre',
      'perante',
      'sem',
      'sob',
      'sobre',
      'trás',
      'tras',
      'coisas',
      'coisa'
    ]

    const map = {
      â : 'a',
      Â : 'A',
      à : 'a',
      À : 'A',
      á : 'a',
      Á : 'A',
      ã : 'a',
      Ã : 'A',
      ê : 'e',
      Ê : 'E',
      è : 'e',
      È : 'E',
      é : 'e',
      É : 'E',
      î : 'i',
      Î : 'I',
      ì : 'i',
      Ì : 'I',
      í : 'i',
      Í : 'I',
      õ : 'o',
      Õ : 'O',
      ô : 'o',
      Ô : 'O',
      ò : 'o',
      Ò : 'O',
      ó : 'o',
      Ó : 'O',
      ü : 'u',
      Ü : 'U',
      û : 'u',
      Û : 'U',
      ú : 'u',
      Ú : 'U',
      ù : 'u',
      Ù : 'U',
      ç : 'c',
      Ç : 'C'
    }

    s = s.replace(/[\W\[\] ]/g, a => map[a] || a).replace(/[&\/\\#,+@()$~%.'":!^&*?<>_{}]/g, '').toLowerCase()

    const words = s.match(/[^\s]+|\s+[^\s+]$/g)

    for (x = 0; x < words.length; x++) {
      for (y = 0; y < stop_words.length; y++) {
        word = words[x].replace(/\s+|[^a-z]+/ig, '')
        stop_word = stop_words[y]
        if (word.toLowerCase() == stop_word) {
          regex_str = `^\\s*${stop_word}\\s*$`
          regex_str += `|^\\s*${stop_word}\\s+`
          regex_str += `|\\s+${stop_word}\\s*$`
          regex_str += `|\\s+${stop_word}\\s+`
          regex = new RegExp(regex_str, 'ig')
          s = s.replace(regex, ' ').trim()
        }
      }
    }
    return s.replace(/^\s+|\s+$/g, '')
  }

  return keywordLinter
}
