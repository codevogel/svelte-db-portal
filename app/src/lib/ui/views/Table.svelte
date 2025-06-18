<script lang="ts">
	import { goto } from '$app/navigation';

	export interface TableData {
		caption?: string;
		columns: string[];
		rows: TableRow[];
	}

	export interface TableRow {
		values: (string | number | null)[];
		url?: string;
	}

	let { table }: { table: TableData } = $props();
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
				{#each table.rows as row, index (index)}
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
</section>
