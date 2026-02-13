export const createFieldCollector = () => ({
    groups: new Map(),
    computed: undefined
});

export const pushCollectedToGroups = (collector, collected, options = {}) => {
    const {
        skipHidden = true,
        skipLogic = false,
        groupResolver,
        mapItem
    } = options;

    const { field, isShown, value, rawValue, issues, computed } = collected;
    if (computed != null) { collector.computed = computed; }
    if (skipHidden && !isShown) { return; }
    if (skipLogic && field.logic) { return; }

    const group = groupResolver ? groupResolver(collected) : (field.group || "other");
    if (!group) { return; }

    if (!collector.groups.has(group)) { collector.groups.set(group, []); }

    const baseItem = { field, value, rawValue, issues, computed };
    const item = mapItem ? mapItem(baseItem, collected) : baseItem;
    collector.groups.get(group).push(item);
};
