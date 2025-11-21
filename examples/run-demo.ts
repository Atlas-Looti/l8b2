
import { Tokenizer, Parser, Compiler, Runner, Processor, Program } from "../packages/lootiscript/src";
import { readFileSync } from "fs";
import { join } from "path";

const demoFile = join(__dirname, "phase2-demo.loot");
console.log(`Running ${demoFile}...`);

const source = readFileSync(demoFile, "utf-8");

// Expose classes to globalThis for Runner
(globalThis as any).Compiler = Compiler;
(globalThis as any).Processor = Processor;
(globalThis as any).Program = Program;

try {
    // 1. Tokenize
    const tokenizer = new Tokenizer(source, "phase2-demo.loot");

    // Mock L8BVM context
    const mockL8BVM = {
        context: {
            global: {},
            meta: {
                print: (text: string) => console.log(text),
            },
            warnings: {
                using_undefined_variable: {},
                assigning_field_to_undefined: {},
                invoking_non_function: {},
                assigning_api_variable: {},
                assignment_as_condition: {},
            },
        },
    };

    // 2. Run using Runner directly (it handles parsing and compiling)
    // We need to cast mockL8BVM to any because we are not importing the full L8BVM interface
    const runner = new Runner(mockL8BVM as any);
    runner.run(source, "phase2-demo.loot");

} catch (e) {
    console.error("Error:", e);
}
