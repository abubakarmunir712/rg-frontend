export function About() {
  return (
    <main className="min-h-[calc(100vh-200px)] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Introduction Section */}
        <section className="text-center mb-12 sm:mb-16" aria-labelledby="about-heading">
          <h1 id="about-heading" className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4 sm:mb-6 px-4">
            About Research Gennie
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed px-4">
            Research Gennie is an AI-powered platform designed to help researchers identify
            unexplored areas and emerging opportunities in their fields. By analyzing thousands
            of academic papers, we provide comprehensive research gap analyses that guide
            researchers toward impactful and novel contributions.
          </p>
        </section>

        {/* How It Works Section */}
        <section className="mb-12 sm:mb-16" aria-labelledby="how-it-works-heading">
          <h2 id="how-it-works-heading" className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 text-center mb-8 sm:mb-12 px-4">
            How It Works
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Step 1 */}
            <div className="text-center p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-xl sm:text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Enter Your Domain
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Simply input your research domain or area of interest. You can also add advanced
                filters like year range, keywords, and number of papers to analyze.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-xl sm:text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                AI Analysis
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Our AI engine processes thousands of academic papers, identifying patterns,
                trends, and most importantly, the gaps where research is lacking or unexplored.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-xl sm:text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Get Insights
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Receive a comprehensive report highlighting research gaps, complete with relevant
                papers and actionable insights to guide your next research project.
              </p>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-12 sm:mb-16" aria-labelledby="team-heading">
          <h2 id="team-heading" className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 text-center mb-8 sm:mb-12 px-4">
            Our Team
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Team Member 1 */}
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4" role="img" aria-label="Avatar for Dr. Sarah Kim">
                <span className="text-3xl font-bold text-white" aria-hidden="true">DK</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">
                Dr. Sarah Kim
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-2">Co-Founder & CEO</p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                PhD in Computer Science, specializing in AI and Natural Language Processing
              </p>
            </div>

            {/* Team Member 2 */}
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4" role="img" aria-label="Avatar for Michael Patel">
                <span className="text-3xl font-bold text-white" aria-hidden="true">MP</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">
                Michael Patel
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-2">Co-Founder & CTO</p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Former ML Engineer at leading tech companies, expert in scalable AI systems
              </p>
            </div>

            {/* Team Member 3 */}
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4" role="img" aria-label="Avatar for Dr. Emily Chen">
                <span className="text-3xl font-bold text-white" aria-hidden="true">EC</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">
                Dr. Emily Chen
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-2">Head of Research</p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Research scientist with 10+ years experience in academic publishing and analysis
              </p>
            </div>
          </div>
        </section>

        {/* Vision Section */}
        <section className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6 sm:p-8 md:p-12 transition-all duration-200 hover:shadow-lg" aria-labelledby="vision-heading">
          <h2 id="vision-heading" className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 text-center mb-4 sm:mb-6">
            Our Vision
          </h2>
          <div className="space-y-4 text-gray-600 dark:text-gray-400">
            <p className="text-base sm:text-lg leading-relaxed">
              We envision a future where every researcher has access to powerful AI tools that
              accelerate discovery and innovation. Research Gennie is just the beginning of our
              mission to democratize research intelligence.
            </p>
            <p className="text-base sm:text-lg leading-relaxed">
              In the coming months, we plan to expand our capabilities to include:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 text-sm sm:text-base">
              <li>Multi-domain cross-analysis to identify interdisciplinary opportunities</li>
              <li>Collaboration features to connect researchers working on similar gaps</li>
              <li>Real-time tracking of emerging research trends and hot topics</li>
              <li>Integration with major academic databases and citation networks</li>
              <li>Personalized research recommendations based on your interests and history</li>
            </ul>
            <p className="text-base sm:text-lg leading-relaxed mt-6">
              Join us on this journey to transform how research is discovered, conducted, and
              shared across the global academic community.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
