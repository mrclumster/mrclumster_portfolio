import { techStack } from "@/data/tech-stack";
import { NeuralNetwork } from "./neural-network";

function categoryDir(name: string) {
  return name.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function StackTree() {
  return (
    <div className="font-mono text-[13px] leading-[1.6] space-y-4">
      <NeuralNetwork />
      <div className="space-y-3">
        {techStack.map((cat) => (
          <div key={cat.category}>
            <p>
              <span className="opacity-60">drwxr-xr-x</span>{" "}
              <span>{categoryDir(cat.category)}/</span>
            </p>
            <ul className="ml-4 grid grid-cols-[max-content_1fr] gap-x-4">
              {cat.items.map((item, idx) => {
                const isLast = idx === cat.items.length - 1;
                return (
                  <li key={item.name} className="contents">
                    <span className="opacity-50">{isLast ? "└──" : "├──"}</span>
                    <span>
                      {item.name}
                      {item.version ? <span className="opacity-50 ml-3">{item.version}</span> : null}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
