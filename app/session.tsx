import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FeedbackBlock } from "../components/FeedbackBlock";
import { OptionButton } from "../components/OptionButton";
import { QuestionDiagram } from "../components/QuestionDiagram";
import { ProgressBar } from "../components/ProgressBar";
import { UnitToggle } from "../components/UnitToggle";
import { activeVariant, getFreeQuestions, getQuestionsForBlock } from "../lib/bank";
import { shuffledVariant } from "../lib/optionOrder";
import { useStore, weakFirstOrder } from "../lib/store";
import { blockLabels, mono, useTheme } from "../lib/theme";
import { reportQuestion, REPORT_EMAIL } from "../lib/report";
import { ExamRecord, Question } from "../lib/types";

const EXAM_CAP = 50;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function fmtClock(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function Session() {
  const theme = useTheme();
  const router = useRouter();
  const { module, block, mode, free } = useLocalSearchParams<{
    module?: string;
    block: string;
    mode: string;
    free?: string;
  }>();
  const isFree = free === "1";
  const isExam = mode === "exam" && !isFree;

  const unit = useStore((s) => s.unit);
  const progress = useStore((s) => s.progress);
  const recordAnswer = useStore((s) => s.recordAnswer);
  const bookmarks = useStore((s) => s.bookmarks);
  const reported = useStore((s) => s.reported);
  const toggleBookmark = useStore((s) => s.toggleBookmark);
  const toggleReport = useStore((s) => s.toggleReport);
  const addExam = useStore((s) => s.addExam);

  const questions: Question[] = useMemo(() => {
    if (isFree) {
      // Fixed first-N sampler for this module, in bank order (same 10 every time).
      return getFreeQuestions(module ?? "");
    }
    const pool = getQuestionsForBlock(module ?? "", block ?? "all");
    if (isExam) {
      const shuffled = shuffle(pool);
      return shuffled.slice(0, Math.min(EXAM_CAP, shuffled.length));
    }
    const order = weakFirstOrder(progress, pool.map((q) => q.id));
    const byId = new Map(pool.map((q) => [q.id, q]));
    return order.map((id) => byId.get(id)!).filter(Boolean);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [module, block, mode, free]);

  const [idx, setIdx] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [examAnswers, setExamAnswers] = useState<Record<string, number>>({});
  const [elapsed, setElapsed] = useState(0);
  const [sending, setSending] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isExam) {
      timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [isExam]);

  if (questions.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg, padding: 16 }}>
        <Text style={{ color: theme.ink }}>No questions available.</Text>
      </SafeAreaView>
    );
  }

  const q = questions[idx];
  const variant = shuffledVariant(q.id, activeVariant(q, unit));
  const isLast = idx === questions.length - 1;
  const saved = bookmarks.includes(q.id);
  const flagged = reported.includes(q.id);

  function choosePractice(optionIndex: number) {
    if (answered) return;
    setSelected(optionIndex);
    setAnswered(true);
    // Free sampler is a test-drive only - nothing is recorded.
    if (!isFree) recordAnswer(q.id, optionIndex === variant.answer ? "correct" : "incorrect");
  }

  function chooseExam(optionIndex: number) {
    setExamAnswers((prev) => ({ ...prev, [q.id]: optionIndex }));
  }

  async function sendReport() {
    if (sending) return;
    setSending(true);
    const pick = isExam ? examAnswers[q.id] ?? null : selected;
    const res = await reportQuestion({
      questionId: q.id,
      moduleId: module ?? "",
      blockKey: block ?? "all",
      variant,
      selectedIndex: pick,
    });
    setSending(false);
    if (res === "unavailable") {
      Alert.alert(
        "No mail app set up",
        `Email ${REPORT_EMAIL} directly and include the question ID ${q.id} with what looks wrong.`,
      );
    }
  }

  function next() {
    if (isLast) {
      if (isExam) finishExam();
      else if (isFree) router.replace({ pathname: "/free-complete", params: { module: module ?? "" } });
      else router.back();
      return;
    }
    setIdx((i) => i + 1);
    setAnswered(false);
    setSelected(null);
  }

  function finishExam() {
    if (timerRef.current) clearInterval(timerRef.current);
    let score = 0;
    const byBlock: Record<string, { correct: number; total: number }> = {};
    const missed: { id: string; picked: number | null }[] = [];
    for (const question of questions) {
      const av = activeVariant(question, unit);
      const v = shuffledVariant(question.id, av);
      const pick = examAnswers[question.id]; // display index, or undefined if skipped
      const answeredThis = pick !== undefined;
      const correct = answeredThis && pick === v.answer;
      if (correct) score += 1;
      else {
        // map the display pick back to the canonical (pre-shuffle) index so it
        // survives reshuffles and app reloads; null marks a skipped question
        const canonical = answeredThis ? av.options.indexOf(v.options[pick]) : null;
        missed.push({ id: question.id, picked: canonical });
      }
      recordAnswer(question.id, correct ? "correct" : "incorrect");
      const bk = question.topic;
      if (!byBlock[bk]) byBlock[bk] = { correct: 0, total: 0 };
      byBlock[bk].total += 1;
      if (correct) byBlock[bk].correct += 1;
    }
    const rec: ExamRecord = {
      id: `exam-${Date.now()}`,
      dateISO: new Date().toISOString(),
      module: module ?? "",
      blockKey: block ?? "all",
      score,
      total: questions.length,
      byBlock,
      missed,
    };
    addExam(rec);
    router.replace("/results");
  }

  const label = block === "all" ? "All topics" : blockLabels[block ?? ""] ?? block;
  const examPick = examAnswers[q.id];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={["bottom"]}>
      {/* Header */}
      <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <View>
            <Text style={{ fontFamily: mono, fontSize: 10, fontWeight: "700", letterSpacing: 1, color: theme.amberText }}>
              {(label ?? "").toString().toUpperCase()}
            </Text>
            <Text style={{ fontFamily: mono, fontSize: 11, color: theme.muted, marginTop: 2 }}>
              {`Q${idx + 1}/${questions.length} \u00b7 ${isFree ? "FREE SAMPLE" : isExam ? "EXAM" : "PRACTICE"}`}
              {isExam ? `  \u00b7  ${fmtClock(elapsed)}` : ""}
            </Text>
          </View>
          {!isFree && (
            <View style={{ flexDirection: "row", gap: 16, alignItems: "center" }}>
              <Pressable onPress={() => toggleBookmark(q.id)} hitSlop={8}>
                <Text style={{ fontSize: 19, color: saved ? theme.amber : theme.muted }}>
                  {saved ? "\u2605" : "\u2606"}
                </Text>
              </Pressable>
              <Pressable onPress={() => toggleReport(q.id)} hitSlop={8}>
                <Text style={{ fontSize: 17, color: flagged ? theme.red : theme.muted }}>{"\u2691"}</Text>
              </Pressable>
            </View>
          )}
        </View>
        <ProgressBar value={(idx + (answered || examPick != null ? 1 : 0)) / questions.length} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {q.requiresUnits && (
          <View style={{ flexDirection: "row", justifyContent: "flex-end", marginBottom: 12 }}>
            <UnitToggle />
          </View>
        )}

        {q.diagram && <QuestionDiagram spec={q.diagram} />}

        <Text style={{ fontSize: 16, lineHeight: 23, color: theme.ink, marginBottom: 18, fontWeight: "500" }}>
          {variant.stem}
        </Text>

        <View style={{ gap: 9 }}>
          {variant.options.map((opt, i) => {
            const answeredState = isExam ? false : answered;
            const selectedIndex = isExam ? (examPick ?? null) : selected;
            const examSelected = isExam && examPick === i;
            return (
              <View
                key={i}
                style={examSelected ? { borderRadius: 9, borderWidth: 1.5, borderColor: theme.amber } : undefined}
              >
                <OptionButton
                  index={i}
                  label={opt}
                  answered={answeredState}
                  isCorrect={i === variant.answer}
                  isSelected={selectedIndex === i}
                  onPress={() => (isExam ? chooseExam(i) : choosePractice(i))}
                />
              </View>
            );
          })}
        </View>

        {!isExam && answered && <FeedbackBlock variant={variant} selectedIndex={selected ?? -1} />}

        {flagged && (
          <View style={{ marginTop: 14, gap: 9 }}>
            <Text style={{ fontFamily: mono, fontSize: 10, color: theme.redText, letterSpacing: 0.5 }}>
              FLAGGED FOR REVIEW
            </Text>
            <Pressable onPress={sendReport} disabled={sending} hitSlop={6}>
              <Text style={{ fontFamily: mono, fontSize: 11, color: theme.amberText, letterSpacing: 0.5 }}>
                {sending ? "OPENING MAIL\u2026" : "EMAIL THIS TO THE DEVELOPER \u25b8"}
              </Text>
            </Pressable>
          </View>
        )}
      </ScrollView>

      {/* Footer */}
      <View
        style={{
          padding: 16,
          borderTopWidth: 1,
          borderTopColor: theme.border,
          flexDirection: "row",
          justifyContent: "flex-end",
        }}
      >
        <Pressable
          onPress={next}
          disabled={!isExam && !answered}
          style={{
            backgroundColor: !isExam && !answered ? theme.bgPanel : theme.amber,
            borderWidth: 1,
            borderColor: !isExam && !answered ? theme.border : theme.amber,
            paddingVertical: 13,
            paddingHorizontal: 30,
            borderRadius: 10,
          }}
        >
          <Text
            style={{
              fontFamily: mono,
              color: !isExam && !answered ? theme.muted : theme.onAccent,
              fontSize: 13,
              fontWeight: "700",
              letterSpacing: 0.5,
            }}
          >
            {isLast ? (isExam ? "FINISH \u2192" : "DONE") : "NEXT \u2192"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
