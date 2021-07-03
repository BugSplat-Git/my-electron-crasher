
export function uncaughtException() {
    generateStackFramesAndCrash();
}

export async function unhandledRejection() {
    return generateStackFramesAndCrash();
}

function generateStackFramesAndCrash() {
    sampleStackFrame0();
}

function sampleStackFrame0() {
    sampleStackFrame1();
}

function sampleStackFrame1() {
    sampleStackFrame2();
}

function sampleStackFrame2() {
    crash();
}

function crash() {
    throw new Error("BugSplat!");
}