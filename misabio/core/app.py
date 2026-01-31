import asyncio

import cognee  # type: ignore[import-untyped]


async def main() -> None:
    # Create a clean slate for cognee -- reset data and system state
    await cognee.prune.prune_data()
    await cognee.prune.prune_system(metadata=True)

    # Add sample content
    text = "Cognee turns documents into AI memory."
    await cognee.add(text)

    # Process with LLMs to build the knowledge graph
    await cognee.cognify()

    # Search the knowledge graph
    results = await cognee.search(query_text="What does Cognee do?")

    # Print
    for result in results:
        print(result)


if __name__ == "__main__":
    asyncio.run(main())


if __name__ == "__main__":  # pragma: no cover
    pass
