// Re-import the maintained account schema so list/view rules require an owner token.
migrate((app) => {
  const schemaPath = "/pb_schema/" + $os.getenv("POCKETBASE_SCHEMA") + ".json"
  const contents = $os.readFile(schemaPath)
  const schemaJson = Array.isArray(contents)
    ? String.fromCharCode.apply(null, contents)
    : contents
  app.importCollections(JSON.parse(schemaJson), false)
})
