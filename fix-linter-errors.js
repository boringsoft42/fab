const fs = require("fs");
const path = require("path");

// Common unused imports to remove
const unusedImports = [
  "useRouter",
  "Search",
  "Filter",
  "Progress",
  "Separator",
  "Tabs",
  "TabsContent",
  "TabsList",
  "TabsTrigger",
  "CardHeader",
  "CardTitle",
  "Avatar",
  "AvatarFallback",
  "AvatarImage",
  "Checkbox",
  "Slider",
  "Badge",
  "Input",
  "Select",
  "SelectContent",
  "SelectItem",
  "SelectTrigger",
  "SelectValue",
  "Table",
  "TableBody",
  "TableCell",
  "TableHead",
  "TableHeader",
  "TableRow",
  "DialogContent",
  "useEffect",
  "useRef",
  "Image",
  "BookOpen",
  "Play",
  "Headphones",
  "Calculator",
  "MessageCircle",
  "Award",
  "MapPin",
  "Globe",
  "Phone",
  "Mail",
  "Star",
  "Clock",
  "Video",
  "User",
  "Briefcase",
  "Users",
  "ExternalLink",
  "DollarSign",
  "CheckCircle",
  "Share2",
  "Lightbulb",
  "TrendingUp",
  "Calendar",
  "ThumbsUp",
  "Bookmark",
  "AlertCircle",
  "MessageSquare",
  "Heart",
  "PartyPopper",
  "Send",
  "Trophy",
  "BarChart3",
  "Settings",
  "Pause",
  "Circle",
  "Volume2",
  "VolumeX",
  "Maximize",
  "RotateCcw",
  "RotateCw",
  "QuizComponent",
  "LessonNotes",
  "QuizQuestion",
  "Resource",
  "CourseCategory",
  "CourseLevel",
  "Course",
  "Download",
  "MoreHorizontal",
  "AlertTriangle",
  "DragHandle",
  "Eye",
  "Move",
  "formatDistanceToNow",
  "es",
  "formatDuration",
  "QuizQuestion",
  "Icon",
  "CourseSearchParams",
  "Lesson",
  "Quiz",
  "ApplicationStatus",
  "JobQuestionAnswer",
  "Enrollment",
  "NewsType",
  "NewsStatus",
  "NewsPriority",
  "prisma",
  "dynamic",
  "updateUserRole",
  "err",
  "isHovered",
  "index",
  "placeholder",
  "logoFile",
  "coverFile",
  "imageFile",
  "router",
  "similarJobs",
  "currency",
  "setSortOrder",
  "error",
  "createdJob",
  "setInstitutions",
  "params",
  "setInstitution",
  "isPlaying",
  "setIsPlaying",
  "currentTime",
  "setCurrentTime",
  "duration",
  "setDuration",
  "volume",
  "setVolume",
  "isMuted",
  "setIsMuted",
  "showControls",
  "setShowControls",
  "lessonIndex",
  "setVideoProgress",
  "attemptStartTime",
  "setTimeLeft",
  "isFullscreen",
  "impacts",
];

// Common unused variables to remove
const unusedVariables = [
  "logoFile",
  "coverFile",
  "imageFile",
  "router",
  "similarJobs",
  "currency",
  "setSortOrder",
  "error",
  "createdJob",
  "setInstitutions",
  "params",
  "setInstitution",
  "isPlaying",
  "setIsPlaying",
  "currentTime",
  "setCurrentTime",
  "duration",
  "setDuration",
  "volume",
  "setVolume",
  "isMuted",
  "setIsMuted",
  "showControls",
  "setShowControls",
  "lessonIndex",
  "setVideoProgress",
  "attemptStartTime",
  "setTimeLeft",
  "isFullscreen",
  "impacts",
  "updateUserRole",
  "err",
  "isHovered",
  "index",
  "placeholder",
];

function removeUnusedImports(content, filePath) {
  let modified = false;

  // Remove unused imports from lucide-react
  const lucideImportMatch = content.match(
    /import\s*{([^}]+)}\s*from\s*["']lucide-react["']/
  );
  if (lucideImportMatch) {
    const imports = lucideImportMatch[1].split(",").map((i) => i.trim());
    const usedImports = imports.filter((imp) => {
      const cleanImp = imp.replace(/\s+as\s+\w+/, "").trim();
      return !unusedImports.includes(cleanImp) || content.includes(cleanImp);
    });

    if (usedImports.length !== imports.length) {
      const newImport = `import {\n  ${usedImports.join(",\n  ")}\n} from "lucide-react";`;
      content = content.replace(lucideImportMatch[0], newImport);
      modified = true;
    }
  }

  // Remove unused imports from @/components/ui
  const uiImportMatch = content.match(
    /import\s*{([^}]+)}\s*from\s*["']@\/components\/ui\/([^"']+)["']/
  );
  if (uiImportMatch) {
    const imports = uiImportMatch[1].split(",").map((i) => i.trim());
    const usedImports = imports.filter((imp) => {
      const cleanImp = imp.replace(/\s+as\s+\w+/, "").trim();
      return !unusedImports.includes(cleanImp) || content.includes(cleanImp);
    });

    if (usedImports.length !== imports.length) {
      const newImport = `import { ${usedImports.join(", ")} } from "@/components/ui/${uiImportMatch[2]}";`;
      content = content.replace(uiImportMatch[0], newImport);
      modified = true;
    }
  }

  return { content, modified };
}

function removeUnusedVariables(content) {
  let modified = false;

  // Remove unused variable declarations
  unusedVariables.forEach((varName) => {
    const patterns = [
      new RegExp(
        `const\\s+\\[${varName}\\s*,\\s*set${varName.charAt(0).toUpperCase() + varName.slice(1)}\\]\\s*=\\s*useState\\([^)]*\\);?\\s*`,
        "g"
      ),
      new RegExp(`const\\s+${varName}\\s*=\\s*[^;]+;?\\s*`, "g"),
      new RegExp(`let\\s+${varName}\\s*=\\s*[^;]+;?\\s*`, "g"),
    ];

    patterns.forEach((pattern) => {
      if (pattern.test(content)) {
        content = content.replace(pattern, "");
        modified = true;
      }
    });
  });

  return { content, modified };
}

function fixAnyTypes(content) {
  let modified = false;

  // Replace common any types with more specific types
  const anyReplacements = [
    { pattern: /:\s*any\b/g, replacement: ": unknown" },
    { pattern: /:\s*any\[\]/g, replacement: ": unknown[]" },
    { pattern: /:\s*any\s*=>/g, replacement: ": (value: unknown) =>" },
    { pattern: /:\s*any\s*\)/g, replacement: ": unknown)" },
  ];

  anyReplacements.forEach(({ pattern, replacement }) => {
    if (pattern.test(content)) {
      content = content.replace(pattern, replacement);
      modified = true;
    }
  });

  return { content, modified };
}

function fixUnescapedEntities(content) {
  let modified = false;

  // Fix unescaped quotes
  const quotePatterns = [
    {
      pattern: /"([^"]*)"([^"]*)"([^"]*)"/g,
      replacement: "&ldquo;$1&rdquo;$2&ldquo;$3&rdquo;",
    },
    { pattern: /"([^"]*)"/g, replacement: "&ldquo;$1&rdquo;" },
  ];

  quotePatterns.forEach(({ pattern, replacement }) => {
    if (pattern.test(content)) {
      content = content.replace(pattern, replacement);
      modified = true;
    }
  });

  return { content, modified };
}

function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    let modified = false;
    let newContent = content;

    // Apply fixes
    const importResult = removeUnusedImports(newContent, filePath);
    if (importResult.modified) {
      newContent = importResult.content;
      modified = true;
    }

    const variableResult = removeUnusedVariables(newContent);
    if (variableResult.modified) {
      newContent = variableResult.content;
      modified = true;
    }

    const anyResult = fixAnyTypes(newContent);
    if (anyResult.modified) {
      newContent = anyResult.content;
      modified = true;
    }

    const entityResult = fixUnescapedEntities(newContent);
    if (entityResult.modified) {
      newContent = entityResult.content;
      modified = true;
    }

    if (modified) {
      fs.writeFileSync(filePath, newContent);
      console.log(`Fixed: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (
      stat.isDirectory() &&
      !file.startsWith(".") &&
      file !== "node_modules"
    ) {
      walkDir(filePath);
    } else if (file.endsWith(".tsx") || file.endsWith(".ts")) {
      processFile(filePath);
    }
  });
}

// Start processing from src directory
console.log("Starting to fix linter errors...");
walkDir("./src");
console.log("Finished fixing linter errors.");
