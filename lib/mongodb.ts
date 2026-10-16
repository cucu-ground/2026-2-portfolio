import mongoose from 'mongoose';

// 수업 실습과 같은 방식: 서버리스 환경에서 요청마다 새 연결을 만들지 않도록
// 연결 Promise를 global에 캐시한다.
type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  failedAt?: number;
};

// 연결에 실패하면 잠시 동안은 바로 실패 처리해서, 요청마다 타임아웃(5초)을 기다리지 않게 한다.
const RETRY_COOLDOWN_MS = 30_000;

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache ?? { conn: null, promise: null };
global.mongooseCache = cached;

const DEFAULT_DB_NAME = 'portfolio';

export function hasMongoUri() {
  return Boolean(process.env.MONGODB_URI);
}

// mongodb(+srv)://user:pass@host[,host2]/<DB 이름>?옵션 에서 DB 이름 부분이 있는지 확인
function hasDatabaseName(uri: string) {
  const afterHosts = uri.replace(/^mongodb(\+srv)?:\/\/[^/?]*/, '');
  return /^\/[^/?]+/.test(afterHosts);
}

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI 환경변수가 없습니다. .env.example을 참고해 .env.local을 만들어주세요.');
  }

  if (cached.conn) return cached.conn;

  if (cached.failedAt && Date.now() - cached.failedAt < RETRY_COOLDOWN_MS) {
    throw new Error('MongoDB 연결 실패 후 재시도 대기 중입니다.');
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      // Atlas에서 복사한 연결 문자열에는 보통 DB 이름이 없어서(…mongodb.net/?…) 그대로 쓰면 'test' DB에 저장된다.
      // 주소에 DB 이름이 없을 때만 'portfolio'를 쓴다.
      ...(hasDatabaseName(uri) ? {} : { dbName: DEFAULT_DB_NAME }),
    });
  }

  try {
    cached.conn = await cached.promise;
    cached.failedAt = undefined;
  } catch (err) {
    // 실패한 Promise를 남겨두면 다음 요청도 계속 실패하므로 비운다.
    cached.promise = null;
    cached.failedAt = Date.now();
    throw err;
  }

  return cached.conn;
}
