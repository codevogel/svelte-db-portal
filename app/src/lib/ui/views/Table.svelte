<script lang="ts">
	import { goto } from '$app/navigation';
	import { Pagination } from '@skeletonlabs/skeleton-svelte';
	import { ArrowLeft, ArrowRight, ChevronFirst, ChevronLast, Ellipsis } from 'lucide-svelte';

	export interface TableData {
		caption?: string;
		columns: string[];
		rows: TableRow[];
		paginationOptions?: PaginationOptions;
	}

	export interface TableRow {
		values: (string | number | null)[];
		url?: string;
	}

	export interface PaginationOptions {
		enabled?: boolean;
		page?: number;
		size?: number;
		sizePerPage?: number[];
	}

	const paginationDefaults: PaginationOptions = {
		enabled: true,
		page: 1,
		size: 10,
		sizePerPage: [5, 10]
	};

	let { table }: { table: TableData } = $props();


	// State
	let page = $state(table.paginationOptions?.page ?? paginationDefaults.page!);
	let size = $state(table.paginationOptions?.size ?? paginationDefaults.size!);
	let enabled = $state(table.paginationOptions?.enabled ?? paginationDefaults.enabled!);
	let sizePerPage = $state(table.paginationOptions?.sizePerPage ?? paginationDefaults.sizePerPage!);

	const slicedSource = $derived((source: TableRow[]) =>
		enabled ? source.slice((page - 1) * size, page * size) : source
	);
</script>

<section class="space-y-4">
	<!-- Table -->
	<div class="table-wrap">
		<table class="table caption-bottom">
			{#if table.caption}
				<caption style="white-space: pre-line">{table.caption}</caption>
			{/if}
			<thead>
				<tr>
					{#each table.columns as header, index (index)}
						<th>{header}</th>
					{/each}
				</tr>
			</thead>
			<tbody class="[&>tr]:hover:preset-tonal-primary">
				{#each slicedSource(table.rows) as row, index (index)}
					<tr
						onclick={() => (row.url ? goto(row.url) : null)}
						class={row.url ? 'cursor-pointer' : ''}
					>
						{#each row.values as value, i (i)}
							<td>{value}</td>
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
	{#if enabled}
		<!-- Footer -->
		<footer class="flex justify-between">
			<select
				name="size"
				id="size"
				class="select w-fit max-w-[150px] px-2"
				value={size}
				onchange={(e) => (size = Number(e.currentTarget.value))}
			>
				{#each sizePerPage as v, i (i)}
					<option value={v}>{v} Per Page</option>
				{/each}
				<option value={table.rows.length}>Show All</option>
			</select>
			<!-- Pagination -->
			<Pagination
				data={table.rows}
				{page}
				onPageChange={(e) => (page = e.page)}
				pageSize={size}
				onPageSizeChange={(e) => (size = e.pageSize)}
				siblingCount={4}
			>
				{#snippet labelEllipsis()}<Ellipsis class="size-4" />{/snippet}
				{#snippet labelNext()}<ArrowRight class="size-4" />{/snippet}
				{#snippet labelPrevious()}<ArrowLeft class="size-4" />{/snippet}
				{#snippet labelFirst()}<ChevronFirst class="size-4" />{/snippet}
				{#snippet labelLast()}<ChevronLast class="size-4" />{/snippet}
			</Pagination>
		</footer>
	{/if}
</section>
