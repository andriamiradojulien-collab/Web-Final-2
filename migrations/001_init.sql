CREATE TYPE user_role AS ENUM ('admin', 'student');

CREATE TABLE users (
  id            SERIAL PRIMARY KEY,
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role          user_role NOT NULL,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE courses (
  id          SERIAL PRIMARY KEY,
  code        VARCHAR(50) UNIQUE NOT NULL,
  name        VARCHAR(255) NOT NULL,
  description TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE exams (
  id         SERIAL PRIMARY KEY,
  course_id  INTEGER NOT NULL REFERENCES courses(id) ON DELETE RESTRICT, -- RG-09
  name       VARCHAR(255) NOT NULL,
  start_date TIMESTAMPTZ NOT NULL,
  end_date   TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (end_date > start_date)
);

CREATE TABLE questions (
  id         SERIAL PRIMARY KEY,
  exam_id    INTEGER NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  statement  TEXT NOT NULL,
  points     NUMERIC(5,2) NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE choices (
  id          SERIAL PRIMARY KEY,
  question_id INTEGER NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  text        TEXT NOT NULL,
  is_correct  BOOLEAN NOT NULL DEFAULT FALSE,
  position    SMALLINT NOT NULL
);

CREATE TABLE attempts (
  id           SERIAL PRIMARY KEY,
  student_id   INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  exam_id      INTEGER NOT NULL REFERENCES exams(id) ON DELETE RESTRICT, -- RG-09
  started_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  submitted_at TIMESTAMPTZ,
  score        NUMERIC(6,2),
  UNIQUE (student_id, exam_id) -- RG-02 : garantie en base
);

CREATE TABLE answers (
  id              SERIAL PRIMARY KEY,
  attempt_id      INTEGER NOT NULL REFERENCES attempts(id) ON DELETE CASCADE,
  question_id     INTEGER NOT NULL REFERENCES questions(id) ON DELETE RESTRICT,
  choice_id       INTEGER REFERENCES choices(id) ON DELETE RESTRICT, -- NULL = non répondu (RG-05)
  is_correct      BOOLEAN,
  points_awarded  NUMERIC(5,2) NOT NULL DEFAULT 0,
  UNIQUE (attempt_id, question_id)
);

-- RG-04 : une question doit avoir entre 2 et 6 choix, exactement 1 correct.
-- Trigger de contrainte différée : valide à la fin de la transaction, ce qui
-- permet d'insérer plusieurs choix un par un avant validation finale.
CREATE OR REPLACE FUNCTION check_question_choices() RETURNS TRIGGER AS $$
DECLARE
  qid INTEGER;
  total INTEGER;
  correct_count INTEGER;
BEGIN
  qid := COALESCE(NEW.question_id, OLD.question_id);
  SELECT COUNT(*), COUNT(*) FILTER (WHERE is_correct) INTO total, correct_count
  FROM choices WHERE question_id = qid;
  IF total > 0 AND (total < 2 OR total > 6) THEN
    RAISE EXCEPTION 'RG-04: a question must have between 2 and 6 choices (has %)', total;
  END IF;
  IF total > 0 AND correct_count <> 1 THEN
    RAISE EXCEPTION 'RG-04: a question must have exactly one correct choice (has %)', correct_count;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE CONSTRAINT TRIGGER trg_check_question_choices
AFTER INSERT OR UPDATE OR DELETE ON choices
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW EXECUTE FUNCTION check_question_choices();
