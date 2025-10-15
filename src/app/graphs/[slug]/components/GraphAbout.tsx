"use client";

type GraphAboutProps = {
  description?: string;
  source?: string;
  formula?: string;
  interactionSteps?: string[];
};

export default function GraphAbout({
  description,
  source,
  formula,
  interactionSteps,
}: GraphAboutProps) {
  return (
    <section
      className="bg-white/90 border border-gray-100 rounded-2xl shadow-sm p-6 mt-10 leading-relaxed"
      aria-labelledby="about-section"
    >
      {/* 🔹 Graph Description */}
      {description && (
        <p id="about-section" className="text-gray-700 mb-4">
          {description}
        </p>
      )}

      {/* 🔹 Formula Section */}
      {formula && (
        <div
          className="bg-gray-50 border-l-4 border-indigo-400 p-4 rounded-md text-sm text-gray-800 mb-4"
          role="note"
        >
          <strong className="font-semibold text-indigo-700">Formula:</strong>{" "}
          <span className="text-gray-700">{formula}</span>
        </div>
      )}

      {/* 🔹 Source */}
      {source && (
        <p className="text-sm text-gray-500 mb-3">
          <strong className="font-semibold text-gray-700">Source:</strong>{" "}
          <span className="text-gray-600">{source}</span>
        </p>
      )}

      {/* 🔹 User Interaction Steps */}
      {interactionSteps && interactionSteps.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            How to explore this graph:
          </h3>
          <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
            {interactionSteps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}