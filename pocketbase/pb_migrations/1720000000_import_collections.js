// Import the collection schema selected for this PocketBase service.
migrate((app) => {
  const schemaPath = "/pb_schema/" + $os.getenv("POCKETBASE_SCHEMA") + ".json"
  const contents = $os.readFile(schemaPath)
  const schemaJson = Array.isArray(contents)
    ? String.fromCharCode.apply(null, contents)
    : contents
  const collections = JSON.parse(schemaJson)
  app.importCollections(collections, false)
})
