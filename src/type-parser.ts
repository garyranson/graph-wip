export function parser(type: "function", definition: string): FunctionDeclaration
export function parser(type: "define", definition: string): ClassDeclaration
export function parser(type: string, definition: string): Declaration {
  const rdr = new Reader(new Scanner(definition));

  if (rdr.isEof()) return null;

  return type === 'function'
    ? rdr.eof<FunctionDeclaration>({
      $type: 'FunctionDeclaration',
      identifier: rdr.consume('token'),
      ...(rdr.expect('<') ? {typeParameters: getTypeParameters()} : null),
      ...(rdr.expect('(') ? {parameterList: getParameterList()} : null),
      ...(rdr.expect(':') ? {returnType: getTypeReference()} : null)
    })
    : rdr.eof<ClassDeclaration>({
      $type: 'ClassDeclaration',
      identifier: rdr.consume('token'),
      ...(rdr.expect('<') ? {typeParameters: getTypeParameters()} : null),
      ...(rdr.expect('extends') ? {classHeritage: getTypeReference()} : null)
    });

  function getTypeReferences(): TypeReference[] {
    if (!rdr.expect('<')) return;
    const typeReferences: TypeReference[] = [];
    while (true) {
      typeReferences.push(getTypeReference());
      if (rdr.expect('>')) return typeReferences;
      if (rdr.expect(',')) continue;
      throw rdr.createSymbolError([',', '>']);
    }
  }

  function getTypeParameters(): TypeParameter[] {
    if (rdr.expect('>')) return;

    const t: TypeParameter[] = [];

    while (true) {
      t.push({
        identifier: rdr.consume('token'),
        ...(rdr.expect('extends') ? {constraint: getTypeReference()} : null)
      });

      if (rdr.expect('>')) return t;
      if (rdr.expect(',')) continue;
      throw rdr.createSymbolError([',', '>']);
    }
  }

  function getParameterList(): RequiredParameter[] {
    if (rdr.expect(')')) return;

    const t: RequiredParameter[] = [];

    while (true) {
      t.push({
        identifier: rdr.consume('token'),
        type: rdr.expect(':') ? getTypeReference() : null
      });

      if (rdr.expect(')')) return t;
      if (rdr.expect(',')) continue;
      throw rdr.createSymbolError([',', ')']);
    }
  }

  function getTypeReference(): TypeReference {
    return {
      qualifiedIdentifier: getQualifiedIdentifier(),
      typeArguments: getTypeReferences()
    }
  }

  function getQualifiedIdentifier(): QualifiedIdentifier {
    let identifier = rdr.consume('token');
    return rdr.expect('.')
      ? getModuleIdentifier(identifier)
      : {identifier};
  }

  function getModuleIdentifier(identifier: LexerToken): QualifiedIdentifier {
    const module = [];
    do {
      module.push(identifier);
      identifier = rdr.consume('token');
    } while (rdr.expect('.'));

    return {module, identifier}
  }

}

class Reader {
  current: LexerToken;

  constructor(private scanner: Scanner) {
    this.current = this.scanner.next();
  }

  eof<T>(value: T): T {
    if (this.current.type !== 'eof') throw new Error('expected eof');
    return value;
  }

  isEof(): boolean {
    return (this.current.type === 'eof');
  }

  expect(value: string): boolean {
    if (this.current.value !== value) return false;
    this.current = this.scanner.next();
    return true;
  }

  consume(type: string): LexerToken {
    if (this.current.type !== type) throw this.createError(type);

    try {
      return this.current;
    }
    finally {
      this.current = this.scanner.next();
    }
  }

  createError(type: string): Error {
    return new Error(`expected ${type} got ${this.current.type}`);
  }

  createSymbolError(values: string[]): Error {
    return new Error(`expected one of ${values.map((v) => `"${v}"`).join(',')} got ${this.current.value}`);
  }
}

export class Scanner {
  private str: string;
  private idx: number;
  private eof: boolean;
  private mark: number;

  constructor(str: string) {
    this.str = str || "";
    this.idx = 0;
    this.mark = 0;
    this.eof = !str;
  }

  next(): LexerToken {
    const ch = this.readPastWhitespace();
    return ((ch >= 65 && ch <= 90) || (ch >= 97 && ch <= 122) || ch === 95 || ch === 36)  /*A-Z$_*/
      ? this.readIdentifier()
      : ((ch >= 48 && ch <= 57) || (ch === 46 && this.peek1() >= 48 && this.peek1() <= 57)) /* [0-9] */
        ? this.readNumber()
        : ((ch === 34 /*"*/ || ch === 39 /*' */))
          ? this.readString(ch === 34 ? "\"" : "'")
          : ch
            ? this.readSymbol(ch)
            : this.createEofToken();
  }

  readPastWhitespace(): number {
    let ch = this.eof ? 0 : this.str.charCodeAt(this.idx);
    while (ch === 32 || ch === 9 || ch === 10 || ch === 13 || ch === 160) {
      ch = this.str.charCodeAt(++this.idx);
    }
    this.mark = this.idx;
    return ch;
  }

  readString(quoteChar: string): LexerToken {
    this.consume(); // eat quote character
    let slash = this.str.indexOf("\\", this.idx);
    let quote = this.str.indexOf(quoteChar, this.idx);
    return slash === -1 && quote !== -1
      ? this.createStringToken(quote)
      : this.readComplexString(quoteChar, quote, slash);
  }

  readComplexString(q: string, quote: number, slash: number): LexerToken {
    const str = this.str;
    let sb = "";
    let i = this.idx;
    while (quote !== -1) {
      // no slash or quote before slash
      if (slash === -1 || quote < slash) {
        return this.createStringToken(quote, sb + str.substring(i, quote));
      }
      sb += (str.substring(i, slash) + unescape(str.charCodeAt(slash + 1)));
      i = slash + 2;
      if (quote < i) {
        quote = str.indexOf(q, i);
      }
      slash = str.indexOf("\\", i);
    }
    throw this.raiseError("Unterminated quote");
  }

  readNumber(): LexerToken {
    let ch = this.consume();

    while (ch >= 48 && ch <= 57) {    // 0...9
      ch = this.consume();
    }

    if (ch === 46) {
      ch = this.consume();
      while (ch >= 48 && ch <= 57) {    // 0...9
        ch = this.consume();
      }
    }
    return this.createToken("number", 0);
  }

  readIdentifier(): LexerToken {
    let ch = this.consume();
    while (ch === 36 || ch === 95 || (ch >= 65 && ch <= 90) || (ch >= 97 && ch <= 122) || (ch >= 48 && ch <= 57)) {    // 0...9
      ch = this.consume();
    }
    return this.createToken("token", 0);
  }

  readSymbol(ch: number): LexerToken {
    return this.createToken("symbol",
      (ch === 60 /*<*/ || ch === 62 /*>*/)
        ? ((this.peek1() === 61 /*=*/) ? 2 : 1)
        : (ch === 38 /*&*/ || ch === 124 /*|*/)
        ? ((this.peek1() === ch /*=*/) ? 2 : 1)
        : ((ch === 61 /*=*/ || ch === 33 /*!*/) && this.peek1() === 61 /*=*/)
          ? ((this.peek2() === 61) ? 3 : 2)
          : 1
    );
  }

  raiseError(msg: string) {
    this.idx = this.str.length;
    this.eof = true;
    return Error(msg);
  }

  peek1(): number {
    return this.str.charCodeAt(this.idx + 1);
  }

  peek2(): number {
    return this.str.charCodeAt(this.idx + 2);
  }

  consume(): number {
    return this.str.charCodeAt(++this.idx);
  }

  createToken(type: string, skip: number): LexerToken {
    this.idx += skip;
    return {type, value: this.str.substring(this.mark, this.idx), start: this.mark, end: this.idx - 1};
  }

  createEofToken(): LexerToken {
    this.idx = this.str.length;
    this.eof = true;
    return {type: "eof", value: "", start: this.str.length, end: this.str.length};
  }

  createStringToken(endPos: number, str?: string): LexerToken {
    this.idx = endPos + 1;
    return {type: "string", value: str || this.str.substring(this.mark + 1, endPos), start: this.mark, end: endPos};
  }
}

function unescape(ch: number): string {
  switch (ch) {
    case 114 :
      return "\r";
    case 102 :
      return "\f";
    case 110 :
      return "\n";
    case 116 :
      return "\t";
    case 118 :
      return "\v";
    case 92 :
      return "\\";
    case 39 :
      return "'";
    case 34 :
      return "\"";
    default:
      return String.fromCharCode(ch);
  }
}

export interface LexerToken {
  type: string,
  value: string,
  start: number;
  end: number;
}

export interface Declaration {
  $type: "FunctionDeclaration" | "ClassDeclaration"
}

export interface FunctionDeclaration extends Declaration {
  $type: "FunctionDeclaration",
  identifier: LexerToken;
  typeParameters?: TypeParameter[];
  parameterList?: RequiredParameter[];
  returnType?: TypeReference;
}

export interface TypeParameter {
  identifier: LexerToken;
  constraint: TypeReference;
}

export interface TypeReference {
  qualifiedIdentifier: QualifiedIdentifier;
  typeArguments: TypeReference[]
}

export interface RequiredParameter {
  identifier: LexerToken;
  type?: TypeReference
}

export interface QualifiedIdentifier {
  module?: LexerToken[]
  identifier: LexerToken
}

export interface ClassDeclaration extends Declaration {
  $type: 'ClassDeclaration',
  identifier: LexerToken,
  typeParameters?: TypeParameter[];
  classHeritage?: TypeReference;
}
