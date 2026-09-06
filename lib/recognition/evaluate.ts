export type Calculation = {
  expression: string;
  equation: string;
  result: string;
};

function tokenize(source: string) {
  const cleaned = source
    .replace(/×/g, "*")
    .replace(/[xX]/g, "*")
    .replace(/÷/g, "/")
    .replace(/＋/g, "+")
    .replace(/－/g, "-")
    .replace(/\s+/g, "");

  if (!cleaned) throw new Error("계산할 수식이 없습니다.");
  if (!/^[0-9+\-*/().]+$/.test(cleaned)) {
    throw new Error("숫자와 사칙연산(+ - × ÷)만 계산할 수 있습니다.");
  }

  const tokens: string[] = [];
  let i = 0;
  while (i < cleaned.length) {
    const ch = cleaned[i];
    if ("+-*/()".includes(ch)) {
      tokens.push(ch);
      i += 1;
      continue;
    }
    let number = "";
    while (i < cleaned.length && /[0-9.]/.test(cleaned[i])) {
      number += cleaned[i];
      i += 1;
    }
    if (!number || number.split(".").length > 2) {
      throw new Error("숫자 형식을 읽지 못했습니다.");
    }
    tokens.push(number);
  }
  return tokens;
}

function parse(tokens: string[]) {
  let index = 0;

  const peek = () => tokens[index];
  const eat = (expected?: string) => {
    const token = tokens[index];
    if (expected && token !== expected) {
      throw new Error("수식 형식이 올바르지 않습니다.");
    }
    index += 1;
    return token;
  };

  const parseExpression = (): number => {
    let value = parseTerm();
    while (peek() === "+" || peek() === "-") {
      const op = eat();
      const right = parseTerm();
      value = op === "+" ? value + right : value - right;
    }
    return value;
  };

  const parseTerm = (): number => {
    let value = parseFactor();
    while (peek() === "*" || peek() === "/") {
      const op = eat();
      const right = parseFactor();
      if (op === "/" && right === 0) throw new Error("0으로 나눌 수 없습니다.");
      value = op === "*" ? value * right : value / right;
    }
    return value;
  };

  const parseFactor = (): number => {
    if (peek() === "+") {
      eat();
      return parseFactor();
    }
    if (peek() === "-") {
      eat();
      return -parseFactor();
    }
    if (peek() === "(") {
      eat("(");
      const value = parseExpression();
      eat(")");
      return value;
    }
    const token = eat();
    if (!token || !/^[0-9.]+$/.test(token)) {
      throw new Error("수식 형식이 올바르지 않습니다.");
    }
    return Number(token);
  };

  const value = parseExpression();
  if (index !== tokens.length) throw new Error("수식 형식이 올바르지 않습니다.");
  if (!Number.isFinite(value)) throw new Error("계산 결과를 만들 수 없습니다.");
  return value;
}

function formatNumber(value: number) {
  if (Number.isInteger(value)) return String(value);
  return String(Number(value.toFixed(6)));
}

export function evaluateExpression(raw: string): Calculation {
  const source = raw.split("=")[0].replace(/[`"'“”]/g, "").trim();
  const value = parse(tokenize(source));
  const expression = source.replace(/\s+/g, " ");
  const result = formatNumber(value);
  return {
    expression,
    equation: `${expression} = ${result}`,
    result,
  };
}
