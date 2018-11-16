import {
  ClassDeclaration,
  FunctionDeclaration,
  parser,
  QualifiedIdentifier,
  RequiredParameter,
  TypeParameter,
  TypeReference
} from "../type-parser";

const types = TypeDefinitions();

export interface DataRequiredParameter {
  identifier: string;
  type?: DataTypeReference
}

interface DataTypeParameter {
  name: string;
  constraint?: DataTypeReference;
}

interface DataTypeReference {
  name: string,
  typeArguments?: DataTypeReference[],
  generic: boolean
}

interface DataTypeDeclaration {
  name: string,
  typeParams?: DataTypeParameter[]
  classHeritage?: DataTypeReference
}

interface DataFunctionDeclaration {
  name: string;
  typeParams?: DataTypeParameter[];
  parameterList?: DataRequiredParameter[];
  returnType: DataTypeReference
}

const normalise = Normalise();

function getQualifiedName(p: QualifiedIdentifier): string {
  return p.module && p.module.length
    ? normalise(p.module.map((s) => s.value).join('.') + '.' + p.identifier.value)
    : normalise(p.identifier.value);
}

function getTypeReference(p: TypeReference, typeParams: string[]): DataTypeReference {
  if (!p) return null;
  const name = getQualifiedName(p.qualifiedIdentifier);

  const generic = typeParams ? !!typeParams.find((e) => e === name) : false;

  if (!generic && !types.has(name)) {
    console.log(`!!!!!! type ${name} is not defined`);
  }

  return {
    name,
    ...(p.typeArguments ? {typeArguments: p.typeArguments.map((a) => getTypeReference(a, typeParams))} : null),
    generic
  };
}

function getTypeParameters(p: TypeParameter[]): DataTypeParameter[] {
  return !p ? null : p.map((e: TypeParameter) => ({
    name: normalise(e.identifier.value),
    ...(e.constraint ? {constraint: getTypeReference(e.constraint, null)} : null)
  }));
}

function getParameterList(list: RequiredParameter[], typeParams: string[]): DataRequiredParameter[] {
  return !list ? null : list.map((p: RequiredParameter) => ({
    identifier: normalise(p.identifier.value),
    ...(p.type ? {type: getTypeReference(p.type, typeParams)} : null)
  }));
}

function reduce(a: TypeReference[],arg?: TypeReference[]) : TypeReference[] {
  return a.reduce((a, v) => {
    return v ? a.concat(v.typeArguments ? reduce(v.typeArguments, [v]) : v) : a;
  }, arg || []).filter((e) => e);
}

function makeList(typeParams: TypeParameter[], dataType: TypeReference, params?: RequiredParameter[]) {
  return reduce([].concat(
    dataType,
    typeParams ? typeParams.map((e) => e.constraint) : null,
    params ? params.map((e) => e.type) : null
  ));
}

function compileFunctionDeclaration(ast: FunctionDeclaration): DataFunctionDeclaration {
  const typeParams = getGenericTypes(ast.typeParameters);
  console.log('xxxx',ast);

  makeList(ast.typeParameters, ast.returnType, ast.parameterList).forEach((v:TypeReference) => {
    const q = v.qualifiedIdentifier;
    const name = getQualifiedName(q);
    const start = q.module && q.module.length ? q.module[0].start : q.identifier.start;
    const end = q.identifier.end;
    console.log(`name:${name}:s:${start}:e:${end}`);
  });

  return {
    name: normalise(ast.identifier.value),
    ...(ast.typeParameters ? {typeParams: getTypeParameters(ast.typeParameters)} : null),
    ...(ast.parameterList ? {parameterList: getParameterList(ast.parameterList, typeParams)} : null),
    ...(ast.returnType ? {returnType: getTypeReference(ast.returnType, typeParams)} : null)
  }
}

function getGenericTypes(p: TypeParameter[]): string[] {
  if (!p) return null;
  return p.map((e) => e.identifier.value);
}

function compileTypeDeclaration(ast: ClassDeclaration): DataTypeDeclaration {

  const typeParams = getGenericTypes(ast.typeParameters);

  makeList(ast.typeParameters, ast.classHeritage);

  return {
    name: normalise(ast.identifier.value),
    ...(ast.typeParameters ? {typeParams: getTypeParameters(ast.typeParameters)} : null),
    ...(ast.classHeritage ? {classHeritage: getTypeReference(ast.classHeritage, typeParams)} : null)
  }
}

function compileTypeUsage(ast: ClassDeclaration): DataTypeDeclaration {
  return {
    name: normalise(ast.identifier.value),
    ...(ast.typeParameters ? {typeParams: getTypeParameters(ast.typeParameters)} : null),
    ...(ast.classHeritage ? {classHeritage: getTypeReference(ast.classHeritage, null)} : null)
  }
}

export function testTypes() {

  types.set('string');
  types.set('boolean');
  types.set('number');
  types.set('float');
  types.set('Date');
  types.set('Subject');
  types.set('PersonSubject extends Subject');
  types.set('ManagerSubject extends PersonSubject');
  types.set('EmailSubject extends Subject');
  types.set('EmailSubject2 extends Subject');
  types.set('SubjectSet<T extends Subject>');
  types.set('Set<T>');
  types.set('List<T>');

  const b = parser("function", 'union<T extends Subject>(inputs: List<SubjectSet<T>>) : SubjectSet<T>');
  console.log('function');
  const b2 = compileFunctionDeclaration(b);
  console.log(b2);

  // let t  = 'Set<Subject>';
  const vv = parser('define', 'SubjectSet<PersonSubject>');

  const t = types.get(vv.identifier.value);
  console.log(vv);
  if (!t) throw new Error(`Type not found ${vv.identifier.type}`);
  if (!t.typeParams && !vv.typeParameters) {
    //It's a simple definition
  } else if (t.typeParams && !vv.typeParameters) {
    throw new Error('missing generic definitions');

  } else if (!t.typeParams && vv.typeParameters) {
    throw new Error('missing generic definitions');
  } else if (t.typeParams.length != vv.typeParameters.length) {
    throw new Error('generic parameters length mismatch');
  } else {
    //It's a generic definition
    //t.typeParams
    const r = compileTypeUsage(vv);
    console.log(r);

    const proto = t.typeParams;
    //const resolved = r.typeParams;

    for (let i = 0; i < proto.length; i++) {
      //const p1 = proto[i];
      //const r1 = resolved[i];
      // const c1 = p1.constraint;
      // test than proto constraint is acceptable
    }

    /*
       $ingress: Set<SubjectSet<Subject>>
       $egress: SubjectSet<Subject>

     */


  }

}


export function test<U extends Set<U>>(x: U) {
  return x;
}

interface TypeDefinitions {
  set(d: string): DataTypeDeclaration;

  get(d: string): DataTypeDeclaration;

  has(d: string): boolean;
}

function TypeDefinitions(): TypeDefinitions {
  const map = new Map<string, DataTypeDeclaration>();

  return {
    set(d: string): DataTypeDeclaration {
      const c = compileTypeDeclaration(parser('define', d));
      map.set(c.name, c);
      return c;
    },
    get(d: string): DataTypeDeclaration {
      return map.get(d);
    },
    has(d: string): boolean {
      return map.has(d);
    }
  }
}

function Normalise() {
  const map = new Map<string, string>();
  return (s: string) => {
    return !s ? null : map.get(s) || create(s);
  }

  function create(s: string): string {
    map.set(s, s);
    return s;
  }
}
/*

interface Subject extends Object {
  xx: number;
}
class List<T> extends Array<T> {
}

//Definition
function union<T>(inputs: List<SubjectSet<T>>) : SubjectSet<T> {
  return inputs[0];
}

export class PersonSubject implements Subject {
  id: 123;
  xx: 4556;
}
export class EmailSubject implements Subject {
  emailAddress: 123;
  xx: 4556;
}


export class SubjectSet<T> {
  name: 'bingo';
}

class Union<T extends SubjectSet<Subject>,O extends Subject> {
  input: List<T>;
  output: SubjectSet<O>
}

class Union<T extends SubjectSet<Subject>,O extends Subject> {
  input: List<T>;
  output: SubjectSet<O>
}

export function testusage() {
  const obj = new Union();
  const a = "123";
  const q = obj.input.push(a);
obj.output.
  return q;

}
*/
